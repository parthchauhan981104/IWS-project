// dom queries
const chatList = document.querySelector('.chat-list');
const chatWindow = document.querySelector('.chat-window');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const rooms = document.querySelector('.chat-rooms');
const userp = document.querySelector('.username');
const signoutButton = document.querySelector('.signout-btn');
const themeSwitch = document.querySelector('.dark-check');
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


//dark mode
themeSwitch.addEventListener('change', () => {
  var links = document.getElementsByTagName('link');
  if(links.length==3){  //need to update this value if I ever add anymore link tags

    links[2].remove();

  } else{

    // Get HTML head element
    var head = document.getElementsByTagName('HEAD')[0];   
    // Create new link Element 
    var link = document.createElement('link'); 
    // set the attributes for link element  
    link.rel = 'stylesheet';  
    link.type = 'text/css'; 
    link.href = 'styles-dark.css';  
    // Append link element to HTML head 
    head.appendChild(link);

    }
});


// Init speech synth
const speech = new SpeechSynthesisUtterance();
speech.text = "Welcome to Ninja Chat";
speechSynthesis.speak(speech);

function readButton (text) {
  // console.log(text);
  read(text);
}

function read(text) {
  speech.text = text;
  speechSynthesis.speak(speech);
}


// //translate code
// function translate() {
//   var apiUrl = "google-translate20.p.rapidapi.com/translate?sl=en&text=One&tl=hi";
//   var finalUrl = 'https://cors-anywhere.herokuapp.com/' + apiUrl;
//   fetch(finalUrl, {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "google-translate20.p.rapidapi.com",
// 		"x-rapidapi-key": "c6a47930c0msh7f9ff39574c50b7p1063fbjsn991ebc0d9702"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.log(err);
// });
// }
// translate();


// //location code
// var x = document.getElementById("demo");
// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     alert("Geolocation is not supported by this browser.");
//   }
// }

// function showPosition(position) {
//   console.log("Latitude: " + position.coords.latitude +
//   "Longitude: " + position.coords.longitude);
// }
// getLocation();


// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('gaming', username);


// get chats & render
chatroom.getChats(data => {
  chatUI.render(data);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});  //pass callback that will run inside getChats
