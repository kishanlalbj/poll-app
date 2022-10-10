import React, { useEffect, useState } from "react";

const Question = (props) => {
  const {
    questions,
    page = 0,
    onNext,
    onPrevious,
    onSubmit,
    showNext,
    showPrev,
    showSubmit,
    onSelect
  } = props;

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleChange = (e) => {
    setSelectedAnswer(e.target.value);
    onSelect(e.target.value);
  };

  const handleNext = () => {
    onNext();
  };

  useEffect(() => {
    if (questions[page]?.selectedAnswer)
      setSelectedAnswer(questions[page]?.selectedAnswer);
  }, [page, questions, selectedAnswer]);

  return (
    <div>
      <div className="card">
        <h5 className="question-text">{questions[page]?.text}</h5>

        <ul>
          {questions[page]?.options.map((opt, index) => (
            <li key={opt._id}>
              <input
                type="radio"
                id={`opt-${index}`}
                name={questions[page]._id}
                value={opt._id}
                checked={selectedAnswer === opt._id}
                onChange={handleChange}
              ></input>
              <label className="option-label" for={`opt-${index}`}>
                {opt.text}
              </label>
            </li>
          ))}
        </ul>

        <div className="actions">
          <div>
            {showPrev && <button onClick={onPrevious}>Previous</button>}
          </div>
          <div>
            {showSubmit && (
              <button type="submit" onClick={onSubmit}>
                Submit
              </button>
            )}
            {showNext && <button onClick={handleNext}>Next</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
