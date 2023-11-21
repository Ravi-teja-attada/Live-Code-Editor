import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [inputName, setUsername] = useState("");
  const [inputPwd, setPassword] = useState("");

  const navigate = useNavigate();
  // Function for handling the registration process
  const handleRegister = async () => {
    function isValidString(input) {
      // Regular expression to check if the string adheres to the specified conditions
      const regex = /^[a-zA-Z0-9]([a-zA-Z0-9@]*[a-zA-Z0-9])?$/;
    
      // Test the input string against the regular expression
      const isValid = regex.test(input) && input.length >= 4 && !input.endsWith('@')
    
      return isValid;
    }
    try {
      if(!inputName || !inputPwd){
        toast.error("Username and password are required")
        return
      }
      if(inputName.length < 4){toast.error('Username cannot be less than 4 letters '); return}
      if(inputName.endsWith('@')){toast.error('Username cannot end with @'); return}
      if(!isValidString(inputName)){toast.error('Username can only contain letters, numbers and @'); return}
      if(inputPwd.length < 4){toast.error('Password cannot be less than 4 letters '); return}
      if(inputPwd.endsWith('@')){toast.error('Password cannot end with @'); return}
      if(!isValidString(inputPwd)){toast.error('Password can only contain letters, numbers and @'); return}

      // Send a registration request to the server
      await axios.post("/api/user/register", {
        username: inputName,
        password: inputPwd,
      });
      toast.success("User created")
      navigate('/login')
      
    } catch (err) {
      // Display an error message for registration failure
      toast.error("Something went wrong, try with another username");
    }
  };
  return (
    <div class="form_page">
    <div className="form_card">
      <h2>Register new User</h2>
      <div className="form_wrapper">
        <input
          placeholder="Username"
          value={inputName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Password"
          value={inputPwd}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Join</button>
        <h5>
          Already have an account &nbsp; <a href="/login">login</a>
        </h5>
      </div>
    </div>
    </div>
  );
}

export default Login;
