var socket = io.connect('http://localhost')
    , content = document.getElementById("chat")
    , message = document.getElementById("message")
    , usersList = document.getElementById("usersList")
    , btn = document.getElementById("btn")
    , messages = []
    , userName = null
    , userId = null;


var RefreshChat = function() {
    var html = '';
    for(var i=0; i<messages.length; i++)
        html += "<b>"+messages[i].user+"</b>: "+messages[i].msg+"<br />";
    content.innerHTML = html;
};

var OnChatEntry = function() {
    userName = prompt('Enter your name:');
    messages.push({user: 'server', msg: 'hello '+userName+'!'});
    RefreshChat();
    socket.emit('addUser', userName);
};

OnChatEntry();

socket.on('setUserSocketId', function(data) {
    userId = data;
});

socket.on('send', function (data) {
    messages.push(data);
    RefreshChat();
});

socket.on('userListUpdate', function(data) {
    var html = '';
    for(var i=0; i<data.length; i++)
    {
        if(data[i].id != userId)
            html += "<span class=\"glyphicon glyphicon-user\" style=\"cursor:pointer\"> "+data[i].name+"</span><br />";
        else
            html += "<span class=\"glyphicon glyphicon-user\"> <b>"+data[i].name+"</b></span><br />";
    }
    usersList.innerHTML = html;
});

btn.onclick = function() {
    socket.emit('send', { user: userName, msg: message.value });
    message.value = '';
};
