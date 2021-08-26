const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router')

const PORT = process.env.PORT || 4000

const app = express();
const server = http.createServer(app)
const io = socketio(server)
app.use(router)

// socket is the client that joined
io.on("connection", (socket) => {
    console.log("we have a new connection")

    socket.on("disconnect", () => {
        console.log("user left the chat")

    })
})

server.listen(PORT, () => console.log("Server has started on port " + PORT))