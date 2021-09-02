const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router')

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js")

const PORT = process.env.PORT || 4000

const app = express();
const server = http.createServer(app)
const io = socketio(server, { cors: {origin: "http://localhost:3000", methods: ["GET", "POST"]}})
app.use(router)

// socket is the client that joined
io.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room })

        if (error) return callback(error)

        socket.emit("message", { user: "admin", text: `Welcome to the room ${user.name}`})

        // broadcasts a message to everyone besides this specific user
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} has joined the chat`})

        // joins a user to a room
        socket.join(user.room)

        callback();
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)
        console.log(user)

        io.to(user.room).emit("message", { user: user.name, text: message })
 
        callback();
    })

    socket.on("disconnect", () => { 
        console.log("user left the chat")
    })
})

server.listen(PORT, () => console.log("Server has started on port " + PORT))