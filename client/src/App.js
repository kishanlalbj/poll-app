import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NotFound from "./page/NotFound";
import Polls from "./page/Polls";
import Questions from "./page/Questions";
import Results from "./page/Results";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/polls"></Navigate>}></Route>
        <Route path="/polls" element={<Polls />}></Route>
        <Route path="/polls/:pollId" element={<Questions />}></Route>
        <Route path="/polls/:pollId/result" element={<Results />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
