import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CodeEditor from "./pages/Code-Editor";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<CodeEditor />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </>
  );
}

export default App;
