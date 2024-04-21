const chatForm = document.getElementById('chat-form');

const socket = io();

//Message from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
});

//Message submit
chatForm.addEventListener('submit',e=>{
    e.preventDefault();

    //Get message text from form
    const msg = e.target.elements.msg.value;

    //Emit message to server
    socket.emit('chatMessage',msg);
});

//Output the message from server to DOM
