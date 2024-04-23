const path  = require('path');
const express = require('express');
const http =  require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

const botName = 'IPL Bot'

//Run when client connects
io.on('connection', socket =>{
    socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id, username, room);
    //Create new room in socket
    socket.join(user.room);

    //Welcome current user
    socket.emit('message',formatMessage(botName,'Welcome to ipl chat'));

    //Broadcast when a user connects
    socket.broadcast.to(user.room).emit(
        'message',
        formatMessage(botName,`${user.username} has joined the chat`));
     
    //Send users and room info
     io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
    
    });

    //Listen for chat message from client side
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        //emit the message back to everybody
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit(
            'message',
            formatMessage(botName,`${user.username} has left the chat`));
        }
    });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT,()=>console.log(`Server running on port ${PORT}`));

