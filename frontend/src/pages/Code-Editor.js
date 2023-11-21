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

// Main component for the code editor page
function CodeEditor() {
  const navigate = useNavigate();
  // Ref for storing the code editor content
  const codeRef = useRef(null);
  // Ref for managing the socket connection
  const socketRef = useRef(null);
  // Hook for accessing the current location object from React Router
  const location = useLocation();
  // Hook for accessing URL parameters from React Router
  const { roomId } = useParams();

  const [users, setUsers] = useState([]);

  // Effect for initializing the client and setting up socket events
  useEffect(() => {
    const clientInit = async () => {
      socketRef.current = await initializeSocket();

      // Event listeners for handling connection errors
      socketRef.current.on("connection_error", (err) => handleError(err));
      socketRef.current.on("connection_failed", (err) => handleError(err));

      // Join the room and emit a join event to the server
      socketRef.current.emit(Actions.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Event listener for handling successful join events
      socketRef.current.on(
        Actions.JOINED,
        ({ clients, username, socketId }) => {
          if (username === location.state.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          // Update the list of users and sync the code with the new user
          setUsers(() => [...clients]);
          socketRef.current.emit(Actions.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Event listener for handling user disconnections
      socketRef.current.on(Actions.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        // Remove the disconnected user from the list
        setUsers((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });

      function handleError(err) {
        console.log("error", err);
        toast.error("Socket connection failed try again later");
        navigate("/");
      }
    };

    clientInit();

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Redirect to the home page if the user is not authenticated
  if (!location.state) {
    return <Navigate to="/" />;
  } else {
    console.log("Username is", location.state.username);
  }

  // Function to copy the room ID to the clipboard
  async function inviteUser() {
    console.log(users);
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied");
    } catch (err) {
      toast.error("Unable to copy room Id");
    }
  }

  // Function to leave the room and navigate to the home page
  const leaveRoom = () => {
    navigate("/");
  };

  const userList = users.map((user) => <li>{user.username}</li>);
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
            <button className="exit_button" onClick={leaveRoom}>
              Leave
            </button>
          </div>
        </div>
        
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
        
        
      </div>
    </>
  );
}

export default CodeEditor;
