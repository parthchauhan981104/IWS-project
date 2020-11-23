// dom queries
const chatList = document.querySelector('.chat-list');
const chatWindow = document.querySelector('.chat-window');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');
const userp = document.querySelector('.username');
const signoutButton = document.querySelector('.signout-btn');
var username;


function submitOnEnter(event){
  if(event.which === 13 && !event.shiftKey){
      event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
      event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
  }
}

document.getElementById("newmessage").addEventListener("keypress", submitOnEnter);

// add a new chat
newChatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = newChatForm.newmessage.value.trim();
  username = userp.innerHTML;
  console.log(username); 
  chatroom.addChat(message, username)
    .then(() => {
      newChatForm.reset();
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }) 
    //async methods always return promise. If the return value of an 
    //async function is not explicitly a promise, it will be implicitly 
    //wrapped in a promise, which will be resolved with the value returned 
    //by the async function, or rejected with an exception thrown from, or 
    //uncaught within, the async function.
    .catch(err => console.log(err));
});

// signout
signoutButton.addEventListener('click', e => {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
});


// update the chat room
rooms.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON'){
    chatUI.clear();
    chatroom.updateRoom(e.target.getAttribute('id'));  // unsub from old room realtime listener
    chatroom.getChats(chat => {
      chatUI.render(chat);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }); // sub to new room and render
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});


// Init speech synth
const speech = new SpeechSynthesisUtterance();
speech.text = "Welcome to Ninja Chat";
speechSynthesis.speak(speech);

function speakButton (text) {
  console.log(text);
  speak(text);
}

function speak(text) {
  speech.text = text;
  speechSynthesis.speak(speech);
}

// function translate() {
//   fetch("https://systran-systran-platform-for-language-processing-v1.p.rapidapi.com/translation/text/translate?source=auto&target=fr&input=Hello", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "systran-systran-platform-for-language-processing-v1.p.rapidapi.com",
// 		"x-rapidapi-key": "c6a47930c0msh7f9ff39574c50b7p1063fbjsn991ebc0d9702"
// 	}
//   })
//   .then(res => res.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });
// }

// translate();


// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('gaming', username);


// get chats & render
chatroom.getChats(data => {
  chatUI.render(data);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});  //pass callback that will run inside getChats
