import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "../components/Question";
import axios from "axios";

const Questions = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [page, setPage] = useState(0);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    let pollsLs = localStorage.getItem("polls");
    let polls = JSON.parse(pollsLs);

    if (!polls || !polls.includes(pollId)) {
      setLocked(false);
    }
  }, [pollId]);

  const getQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/polls/questions/${pollId}`);
      setQuestions(res.data);
    } catch (error) {
      setError(error.response.data.error.message);
    } finally {
      setLoading(false);
    }
  }, [pollId]);

  useEffect(() => {
    if (!locked) getQuestions();
  }, [getQuestions, locked]);

  useEffect(() => {
    if (page === questions.length - 1) {
      setShowNext(false);
      setShowPrev(true);
      setShowSubmit(true);
      return;
    }

    if (page === 0) {
      setShowPrev(false);
      setShowNext(true);
      setShowSubmit(false);
      return;
    }

    if (page <= questions.length) {
      setShowPrev(true);
      setShowNext(true);
      setShowSubmit(false);

      return;
    }
  }, [setShowNext, page, questions.length]);

  const handleNextQuestion = () => {
    setPage((prev) => prev + 1);
  };

  const handleSelect = (ans) => {
    const clonnedQuestions = structuredClone(questions);

    clonnedQuestions[page].selectedAnswer = ans;
    setQuestions([...clonnedQuestions]);
  };

  const handlePrevQuestion = () => {
    setPage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await axios.post(`/api/polls/${pollId}/submit`, {
      answers: questions
    });

    const ls = localStorage.getItem("polls");

    if (ls) {
      let polls = JSON.parse(ls);
      polls.push(pollId);
      localStorage.setItem("polls", JSON.stringify(polls));
    } else {
      localStorage.setItem("polls", JSON.stringify([pollId]));
    }
  };

  const handleShowResults = () => {
    navigate(`/polls/${pollId}/result`, { replace: true });
  };

  if (locked)
    return (
      <p className="centered">
        Looks like you already participated in this poll. This poll is locked.
      </p>
    );

  if (loading) return <p className="centered">Loading</p>;
  if (error) return <p className="centered">{error}</p>;

  return (
    <div className="container centered">
      {!submitted && !loading ? (
        <Question
          page={page}
          questions={questions}
          showNext={showNext}
          showPrev={showPrev}
          showSubmit={showSubmit}
          onNext={handleNextQuestion}
          onPrevious={handlePrevQuestion}
          onSubmit={handleSubmit}
          onSelect={handleSelect}
        />
      ) : (
        <div className="card">
          <p>Thank you for your response</p>
          <center>
            <button onClick={handleShowResults}> Show Results </button>
          </center>
        </div>
      )}
    </div>
  );
};

export default Questions;
