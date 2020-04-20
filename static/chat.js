function addMessage(message) {
    let chat = document.querySelector('#chat');
    let container = document.createElement('div');
    let newMessage = document.createElement('p');
    newMessage.classList.add('m-0')
    newMessage.innerText = message.message;
    let timestamp = document.createElement('small');
    timestamp.classList.add('text-muted');
    timestamp.innerText = moment(message.timestamp).format('HH:mm:ss MMM Do');
    container.appendChild(newMessage);
    container.appendChild(timestamp);
    chat.appendChild(container);
}

var socket = io();
socket.on('connect', function() {
    socket.emit('json', {
        message: 'I\'m connected!',
        timestamp: new Date(),
        room: 'main'
    });
    socket.emit('join', {
        username: 'User A',
        room: 'main'
    });
});
socket.on('json', function(response) {
    addMessage(response);
});

socket.on('message', function(response) {
    addMessage(response);
});

function sendMessage(message) {
    socket.emit('json', message);
}

function handleNewMessage() {
    let message = document.querySelector('#message');
    let data = {
        message: message.value,
        timestamp: new Date(),
        room: 'main'
    };
    sendMessage(data);
    message.value = '';
}

document.querySelector('#message').addEventListener('keydown', function (e) {
    if (e.which === 13 || e.keyCode === 13) {
        handleNewMessage();
    }
});
document.querySelector('#send').addEventListener('click', handleNewMessage);
