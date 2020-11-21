// dom queries
const chatList = document.querySelector('.chat-list');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');

// add a new chat
newChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = newChatForm.message.value.trim();
  chatroom.addChat(message)
    .then(() => newChatForm.reset()) 
    //async methods always return promise. If the return value of an 
    //async function is not explicitly a promise, it will be implicitly 
    //wrapped in a promise, which will be resolved with the value returned 
    //by the async function, or rejected with an exception thrown from, or 
    //uncaught within, the async function.
    .catch(err => console.log(err));
});

// update the username
newNameForm.addEventListener('submit', e => {
  e.preventDefault();
  // update name via chatroom
  const newName = newNameForm.name.value.trim(); //can use .name as input field has id=name
  chatroom.updateName(newName);
  // reset the form
  newNameForm.reset();
  // show then hide the update message
  updateMssg.innerText = `Your name was updated to ${newName}`;
  setTimeout(() => updateMssg.innerText = '', 3000);
});

// update the chat room
rooms.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON'){
    chatUI.clear();
    chatroom.updateRoom(e.target.getAttribute('id'));  // unsub from old room realtime listener
    chatroom.getChats(chat => chatUI.render(chat)); // sub to new room and render
  }
});

// check local storage for name
const username = localStorage.username ? localStorage.username : 'anon';
//localStorage is unique for each domain-port combination

// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('gaming', username);

// get chats & render
chatroom.getChats(data => chatUI.render(data));  //pass callback that will run inside getChats
