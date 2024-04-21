const path  = require('path');
const express = require('express');
const http =  require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when client connects
io.on('connection', socket =>{
    //Welcome current user
    socket.emit('message','Welcome to ipl chat');

    //Broadcast when a user connects
    socket.broadcast.emit('message','A user has joined the chat');

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        io.emit('message','A user has left the chat');
    });

    //Listen for chat message from client side
    socket.on('chatMessage',msg=>{
        //emit the message back to everybody
        io.emit('message',msg);
    });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

