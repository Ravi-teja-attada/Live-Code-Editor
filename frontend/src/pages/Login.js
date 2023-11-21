import React, { useState } from "react";
import axios from "../axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [inputName, setUsername] = useState("");
  const [inputPwd, setPassword] = useState("");

  const navigate = useNavigate();

  // Function for handling the login process
  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/user/login", {
        username: inputName,
        password: inputPwd,
      });

       // Extract username and refresh token from the response data
      const { username, refreshToken } = response.data;

      // Store username and refresh token in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("refreshToken", refreshToken);

      // Navigate to the home page with the authenticated username
      navigate(`/`, {
        state: {
          username,
        },
      });
    } catch (err) {
      // Display an error message for invalid credentials
      toast.error("Invalid credentials");
    }
  };
  // Function to handle the "Enter" key press for logging in
  const handleEnter = (e)=>{
    if(e.code === 'Enter'){
      handleLogin()
    }
  }
  return (
    <div class="form_page">
    <div className="form_card">
      <h2>Login your Account</h2>
      <div className="form_wrapper">
        <input
          placeholder="Username"
          value={inputName}
          onChange={(e) => setUsername(e.target.value)}
          onKeyUp={handleEnter}
        />
        <input
          placeholder="Password"
          value={inputPwd}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleEnter}
        />
        <button onClick={handleLogin}>Join</button>
        <h5>
          Don't have an account? &nbsp; 
          <Link to='/register'>register</Link>
          {/* <a href="/register">register</a> */}
        </h5>
      </div>
    </div>
    </div>
  );
}

export default Login;
