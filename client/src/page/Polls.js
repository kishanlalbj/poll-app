import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Polls = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);
  const [error, setError] = useState(null);
  const [locked, setLocked] = useState([]);

  const getPolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/polls");
      setPolls(res.data);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  useEffect(() => {
    let localPolls = localStorage.getItem("polls");
    if (localPolls) setLocked(JSON.parse(localPolls));
  }, []);

  const handlePollClick = (id) => {
    navigate(`/polls/${id}`);
  };

  const handleShowResults = (id) => {
    navigate(`/polls/${id}/result`);
  };

  return (
    <div className="polls">
      <h2>Opened polls</h2>
      {loading && <p>loading</p>}
      {error && <p>{error}</p>}
      <div className="polls-container">
        {polls.map((poll) => (
          <div key={poll._id} className="card polls-card">
            <h3> {poll.name}</h3>

            {!locked.includes(poll._id) ? (
              <button onClick={() => handlePollClick(poll._id)}>
                Take poll
              </button>
            ) : (
              <button onClick={() => handleShowResults(poll._id)}>
                Results
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polls;
