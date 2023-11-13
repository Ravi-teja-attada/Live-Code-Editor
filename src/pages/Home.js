import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room created");
  };

  const joinRoom = (e) => {
    if (!username || !roomId) {
      toast.error("Invalid credentials");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleEnter = (e)=>{
    if(e.code === 'Enter'){
      joinRoom()
    }
  }
  return (
    <div className="login_page">
      <div className="login_card">
        <h1>Join Room</h1>
        <div className="form_wrapper">
          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnter}
          />
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleEnter}
          />
          <button onClick={joinRoom}>Join</button>
          <h4>
            Don't have a room ID? &nbsp;{" "}
            <a href="#" onClick={createRoom}>
              Create room
            </a>
          </h4>
        </div>
      </div>
    </div>
  );
}

export default Home;
