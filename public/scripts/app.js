// dom queries
const chatList = document.querySelector('.chat-list');
const chatWindow = document.querySelector('.chat-window');
const newChatForm = document.querySelector('.new-chat');
const newNameForm = document.querySelector('.new-name');
const updateMssg = document.querySelector('.update-mssg');
const roomsGroup = document.querySelector('.chat-rooms');
const rooms = document.getElementsByClassName('chat-room');
const userp = document.querySelector('.username');
const signoutButton = document.querySelector('.signout-btn');
const themeSwitch = document.querySelector('.dark-check');
const newMessageText = document.querySelector('#newmessage');
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

//remove current-room class from all rooms
function removeCurrentRoom () {
  [...rooms].forEach(room => {
    room.classList.remove('current-room');
  });
}

// update the chat room
roomsGroup.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON'){
    chatUI.clear();
    removeCurrentRoom();
    chatroom.updateRoom(e.target.getAttribute('id'));  // unsub from old room realtime listener
    chatroom.getChats(chat => {
      chatUI.render(chat);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }); // sub to new room and render
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});

////////////////////////////////////////////////////////////////////////
//dark mode
themeSwitch.addEventListener('change', () => {
  var links = document.getElementsByTagName('link');
  if(links.length == 4){  //need to update this value if I ever add anymore link tags

    links[links.length-1].remove();

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

////////////////////////////////////////////////////////////////////////
// Init speech synth - used to read out received messages
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

////////////////////////////////////////////////////////////////////////
// Speech recognition works only on chrome - need to check browser
var isChromium = window.chrome;
var winNav = window.navigator;
var vendorName = winNav.vendor;
var isOpera = typeof window.opr !== "undefined";
var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
var isIOSChrome = winNav.userAgent.match("CriOS");

if (isIOSChrome) {
   // is Google Chrome on IOS
} else if(
  isChromium !== null &&
  typeof isChromium !== "undefined" &&
  vendorName === "Google Inc." &&
  isOpera === false &&
  isIEedge === false
) {
    // is Google Chrome
    console.log('On chrome - will use speech recognition');
    window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new window.SpeechRecognition();
    // Speak result
    recognition.addEventListener('result', onSpeak);
    document.querySelector('.speak-btn').style.display = 'inline';
} else { 
    // not Google Chrome 
    console.log('Not on chrome - no speech recognition feature');
    newMessageText.classList.add('mr-2')
}

// Start speaking
function speakButton() {
  // Start recognition
  recognition.start();
}

// Capture user speak
function onSpeak(e) {
  const msg = e.results[0][0].transcript;
  if(msg){
    newMessageText.value = msg.charAt(0).toUpperCase() + msg.slice(1);
  }
}

////////////////////////////////////////////////////////////////////////
// //translate code - requires new API Key after signing with credit card
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

////////////////////////////////////////////////////////////////////////
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


////////////////////////////////////////////////////////////////////////
// class instances
const chatUI = new ChatUI(chatList);
const chatroom = new Chatroom('gaming', username);


// get chats & render
chatroom.getChats(data => {
  chatUI.render(data);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});  //pass callback that will run inside getChats
