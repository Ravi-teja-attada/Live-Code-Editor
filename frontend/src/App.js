import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CodeEditor from "./pages/Code-Editor";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register";
import Login from "./pages/Login";


function App() {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
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
