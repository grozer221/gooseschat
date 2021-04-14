'use strict'
const socket = io();

document.getElementById('btn-login').addEventListener('click',() => {
    document.getElementById('errorName').innerHTML = '';
    let nickName = document.getElementById('input-name').value;
    if(nickName === ''){
        document.getElementById('errorName').innerHTML = 'Введіть нікнейм';
        return;
    }
    document.getElementById('chat').classList.remove("hidden");
    document.getElementById('form').classList.toggle("hidden");

    socket.emit('enter', nickName);
});

document.getElementById('btn-send').addEventListener('click', () => {
    let message  = document.getElementById('input-message');
    if(message.value === '')
        return;
    socket.emit('sendMessageToServer', message.value);
    message.value = ' ';
});

socket.on('reloadListActiveUsers', users => {
    let divUsers = document.getElementById('list-online-users');
    let ulElem = document.createElement('ul');
    for(let user in users){
        let liElem = document.createElement('li');
        liElem.innerHTML = users[user];
        ulElem.appendChild(liElem);
    }
    divUsers.innerHTML = '';
    divUsers.appendChild(ulElem);
});

socket.on('notifyNameConnectedUser', userName => {
    let elemMessage = document.createElement('div');
    elemMessage.classList.toggle('align-center');
    elemMessage.classList.toggle('style-fontsize-14');
    elemMessage.innerHTML = `Користувач ${userName} приєднався до чату`;
    document.getElementById('messages').appendChild(elemMessage);
});

socket.on('notifyNameDisconnectedUser', userName => {
    if(userName === null)
        return;
    let elemMessage = document.createElement('div');
    elemMessage.classList.toggle('align-center');
    elemMessage.classList.toggle('style-fontsize-14');
    elemMessage.innerHTML = `Користувач ${userName} від'єднався від чату`;
    document.getElementById('messages').appendChild(elemMessage);
});

socket.on('sendMessageToAllUsers', (users, obj) => {
    let messageWraper = document.createElement('div');
    let elemNickNameAndDate = document.createElement('div');
    if(users[socket.id] === obj.nickName) {
        elemNickNameAndDate.innerHTML = 'Ви';
        messageWraper.classList.toggle('align-right');
    }
    else
        elemNickNameAndDate.innerHTML = obj.nickName;

    let date = new Date();
    elemNickNameAndDate.innerHTML += ` (${date.getHours()}:${date.getMinutes()})`;
    elemNickNameAndDate.classList.toggle('style-fontsize-14');

    let elemMessage = document.createElement('div');
    elemMessage.innerHTML = obj.message;

    messageWraper.appendChild(elemNickNameAndDate);
    messageWraper.appendChild(elemMessage);
    let divMessages = document.getElementById('messages');
    divMessages.appendChild(messageWraper);
});


