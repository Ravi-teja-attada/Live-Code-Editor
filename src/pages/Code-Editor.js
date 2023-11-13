import React, { useEffect, useRef, useState } from "react";
import Editor from "../components/Editor";
import { initializeSocket } from "../socket";
import Actions from "../Actions";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { toast } from "react-toastify";

function CodeEditor() {
  const navigate = useNavigate();
  const codeRef = useRef(null)
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function clientInit() {
      socketRef.current = await initializeSocket();
      socketRef.current.on("connection_error", (err) => handleError(err));
      socketRef.current.on("connection_failed", (err) => handleError(err));

      socketRef.current.on(
        Actions.JOINED,
        ({ clients, username, socketId }) => {
          if (username === location.state.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setUsers(() => [...clients]);
          socketRef.current.emit(Actions.SYNC_CODE, {code:codeRef.current, socketId})
        }
      );

      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setUsers((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });

      function handleError(err) {
        console.log("error", err);
        toast.error("Socket connection failed try again later");
        navigate("/");
      }

      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state.username,
      });
    }

    clientInit();

    return () => {
      if (socketRef.current) {
        socketRef.current.off(Actions.JOINED);
        socketRef.current.off(Actions.DISCONNECTED);
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  } else {
    console.log("Username is", location.state.username);
  }

  async function inviteUser() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied");
    } catch (err) {
      toast.error("Unable to copy room Id");
    }
  }

  const leaveRoom = ()=>{
    navigate('/')
  }

  const userList = users.map((user) => <h4>{user.username}</h4>);
  return (
    <>
      <div className="ide_wrapper">
        <div className="side_menu">
          <div className="side_menu_top">
            <h4 className="side_heading">Members In Room</h4>
            {userList}
          </div>
          <div className="side_menu_bottom">
            <button className="invite_button" onClick={inviteUser}>
              Invite
            </button>
            <button className="exit_button" onClick={leaveRoom}>Leave</button>
          </div>
        </div>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}} />
      </div>
    </>
  );
}

export default CodeEditor;
