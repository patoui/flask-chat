window.onload = function () {
    var socket;

    function addMessage(message) {
        let chat = document.querySelector('#chat');
        let wrapper = document.createElement('div');
        wrapper.classList.add('d-flex', 'mb-3');

        let container = document.createElement('div');
        container.classList.add('w-75', 'd-flex', 'flex-column');

        let newMessage = document.createElement('p');
        newMessage.classList.add('m-0', 'py-2', 'px-3');
        newMessage.style.borderRadius = '15px';
        newMessage.innerText = message.message;

        if (message.type === 'info') {
            wrapper.classList.add('text-center');
            container.classList.add('mx-auto');
        } else if (message.username === localStorage.getItem('username')) {
            wrapper.classList.add('text-right');
            container.classList.add('ml-auto');
            newMessage.classList.add('ml-auto', 'text-white', 'bg-primary');
        } else {
            wrapper.classList.add('text-left');
            container.classList.add('mr-auto');
            newMessage.classList.add('mr-auto', 'text-dark', 'bg-light');
        }

        let timestamp = document.createElement('small');
        timestamp.classList.add('text-black-50');
        let footer = '';

        if (message.type !== 'info') {
            footer = message.username + ' &middot; ';
        }
        footer += moment(message.timestamp).format('HH:mm MMM Do');
        timestamp.innerHTML = footer;

        container.appendChild(newMessage);
        container.appendChild(timestamp);
        wrapper.appendChild(container);
        chat.appendChild(wrapper);
    }

    function startChat() {
        socket = io();
        socket.on('connect', function() {
            socket.emit('join', {username: localStorage.getItem('username'), room: 'main'});
        });

        socket.on('json', function(response) {
            addMessage(response);
        });

        socket.on('message', function(response) {
            addMessage(response);
        });
    }

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

    if (localStorage.getItem('username') !== null) {
        startChat();
    } else {
        let username;
        while (!username) {
            username = window.prompt('What is your username?').trim();
        }
        localStorage.setItem('username', username);
        startChat();
    }

    document.querySelector('#edit_username').addEventListener('click', function () {
        let username;
        while (!username) {
            username = window.prompt('What is your username?').trim();
        }
        localStorage.setItem('username', username);
    });
}
