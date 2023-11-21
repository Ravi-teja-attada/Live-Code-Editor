const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const Actions = require("./Actions");
const dbConnect = require("./config/dbConfig");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const io = new Server(server);
const userSocketList = new Map();
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// Connecting to the database
dbConnect();

// Setting up middleware and routes
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Routing for user authentication
app.use("/api/user", authRoute);

// Function to retrieve all clients in a given room
function getAllClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketList[socketId],
      };
    }
  );
}

// Handling socket connections
io.on("connection", (socket) => {
  // Handling user join action
  socket.on(Actions.JOIN, ({ roomId, username }) => {
    userSocketList[socket.id] = username;
    socket.join(roomId);
    const clients = getAllClients(roomId);
    
    // Emitting joined action to all clients in the room
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(Actions.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Handling code change action
  socket.on(Actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(Actions.CODE_CHANGE, { code });
  });
  // Handling code synchronization action
  socket.on(Actions.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(Actions.CODE_CHANGE, { code });
  });

  // Handling socket disconnecting action
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(Actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketList[socket.id],
      });
    });
    delete userSocketList[socket.id];
    socket.leave();
  });
});

//Handling errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
