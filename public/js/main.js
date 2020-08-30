const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = $('ul[class="userlist"]');
const chatInput = document.getElementById('msg');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io({
    reconnectionAttempts: 5,
    timeout: 5000
});

socket.on('customerror', errormsg => {
    window.alert(errormsg);
    window.location.replace("http://mattchat.us.to");
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    if (message) {
        outputMessage(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

socket.on('ytMessage', id => {
    outputYTembed(id);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('reconnect_failed', error => {
    M.toast({html: 'Reconnection failed: ' + error});
});

socket.on('reconnecting', error => {
    M.toast({html: 'Connection lost. Reconnecting...'});
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    const CleanMSG = DOMPurify.sanitize(msg);
    // Emit message to server
    socket.emit('chatMessage', CleanMSG);

    // Clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <li class="collection-item avatar dark" id="msg-1231213">
                        <i class="material-icons circle">account_circle</i>
                        <span class="title">${message.username} | ${message.time}</span>
                        <p>
                            ${message.text}
                        </p>
                    </li>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputYTembed(id) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <div style="padding-left: 4.5%;">
    <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/${id}?controls=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to dom
function outputRoomName(room) {
    roomName.innerText = room;
    document.title = "MattChat | " + room;
}

// Add users to dom
function outputUsers(users) {
    $(".userlist").empty();
    var usercount = 0;
    users.forEach(function(user){
        usercount++;
        $(".userlist").append(`<li class="collection-item dark">${user.username}</li>`);
    });
    $(".usercount").text(usercount);
}

// function geeks(event) { 
//     // 13 is the keycode for "enter" 
//     if (event.keyCode == 13 && !event.shiftKey) { 
//         e.preventDefault();
//         $('.send-button').click();
//         return false;
//     }
// } 

$(document).ready(function () {
    $('.msg').characterCounter();
    $('.character-counter').css("color", "white");
});