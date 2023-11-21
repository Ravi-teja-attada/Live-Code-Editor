import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

import axios from '../axios'

function Home() {
  
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  // Retrieve the username from localStorage
  const username = localStorage.getItem('username')

  // Effect for authenticating the user session
  useEffect(() => {
   const authenticate = async()=>{
    // Retrieve the refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        // Verify the refresh token with the server
        const user = await axios.post('/api/user/verifyToken',{
          token: refreshToken
        })
        if(user) return
      } catch (err) {
        // Handle session expiration error
        toast.error('Session expired')
        navigate('/login')
      }
        
    }else{
      navigate('/login')
    }
    
    }
    authenticate()
    
  }, []);

  // Function for creating a new room
  const createRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room created");
  };

  // Function for joining an existing room
  const joinRoom = (e) => {
    if (!roomId) {
      toast.error("Invalid credentials");
      return;
    }

    // Navigate to the editor page with the provided room ID and username
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  // Function to handle the "Enter" key press for joining a room
  const handleEnter = (e)=>{
    if(e.code === 'Enter'){
      joinRoom()
    }
  }
  return (
    <div className="form_page">
      <div className="form_card">
        <h2>Join Room</h2>
        <div className="form_wrapper">
          <input
            placeholder="Enter a Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnter}
          />
         
          <button onClick={joinRoom}>Join</button>
          <h5>
            Don't have a room ID? &nbsp;{" "}
            <Link onClick={createRoom}>
              Create room
            </Link>
          </h5>
          <h5>
          Click here to &nbsp;{" "}
          <Link onClick={(e)=>{
            e.preventDefault()
            localStorage.removeItem('username')
            localStorage.removeItem('refreshToken')
            navigate('/login')
          }}>Logout</Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Home;
