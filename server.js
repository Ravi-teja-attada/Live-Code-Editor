const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Actions = require("./src/Actions");
const app = express();
const server = http.createServer(app);

const io = new Server(server);
const userSocketList = new Map()

function getAllClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId)||[]).map((socketId)=>{
        return {
            socketId,
            username: userSocketList[socketId]
        }
    })
}

io.on("connection", (socket) => {
    console.log(`socket connected ${socket.id}`)
    socket.on(Actions.JOIN, ({roomId, username})=>{
        userSocketList[socket.id] = username
        socket.join(roomId)
        const clients = getAllClients(roomId)
        console.log(clients)
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(Actions.JOINED,{
                clients,
                username,
                socketId: socket.id
            })
        })
    })

    socket.on(Actions.CODE_CHANGE,({roomId, code})=>{
        socket.in(roomId).emit(Actions.CODE_CHANGE, {code})
    })
    socket.on(Actions.SYNC_CODE, ({roomId, code})=>{
        socket.in(roomId).emit
    })

    socket.on('disconnecting', ()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(Actions.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketList[socket.id]
            })
        })
        delete userSocketList[socket.id]
        socket.leave()
    })
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
