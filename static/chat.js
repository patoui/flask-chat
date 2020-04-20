function addMessage(message) {
    let chat = document.querySelector('#chat');
    let container = document.createElement('div');
    if (message.type === 'info') {
        container.classList.add('text-center');
    } else if (message.username === localStorage.getItem('username')) {
        container.classList.add('text-right');
    } else {
        container.classList.add('text-left');
    }
    let newMessage = document.createElement('p');
    newMessage.classList.add('m-0');
    newMessage.innerText = message.message;
    let timestamp = document.createElement('small');
    timestamp.classList.add('text-muted');
    timestamp.innerText = moment(message.timestamp).format('HH:mm:ss MMM Do');
    container.appendChild(newMessage);
    container.appendChild(timestamp);
    chat.appendChild(container);
}

localStorage.setItem('username', 'pat');

var socket = io();

socket.on('connect', function() {
    socket.emit('join', {username: localStorage.getItem('username'), room: 'main'});
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
        type: 'sent',
        username: localStorage.getItem('username'),
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
