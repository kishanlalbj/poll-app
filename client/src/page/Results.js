import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Results = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState([]);

  const getResults = useCallback(async () => {
    try {
      const res = await axios.get(`/api/polls/${pollId}/result`);

      console.log(res.data);
      setResults(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [pollId]);

  useEffect(() => {
    getResults();
  }, [getResults]);

  return (
    <div className="result-container">
      {results.map((q) => {
        return (
          <div className="card">
            <h1 key={q._id}>{q.text} </h1>

            {q.options.map((o) => {
              if (q.winner === o.votes)
                return (
                  <h3>
                    {o.votes} - {o.text} 👑
                  </h3>
                );
              return (
                <>
                  <p style={{ fontWeight: 500 }}>
                    {" "}
                    {o.votes} - {o.text}
                  </p>
                </>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Results;
