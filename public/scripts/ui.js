class ChatUI {
  constructor(list){
    this.list = list;
  }
  clear(){
    this.list.innerHTML = '';
  }
  render(data){
    const when = dateFns.distanceInWordsToNow(
      data.created_at.toDate(),
      { addSuffix:true } // adds 'ago'. example - 1 day ago
    );
    // console.log(JSON.stringify(data.message));
    var text = data.message;
    var result = text.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img, 
    '<a target="_blank" href="$1">$1</a>');
    const html = `
      <li class="list-group-item container">
        <div class="user-info-div mr-2 my-1">
          <img class="user-img" src="ninja1.png">
          <span class="username mx-1">${data.username}</span>
          <span class="time">${when}</span>
        </div>
        <div class="msg-div mt-1 ml-5">
          <span class="message">${result}</span>
          <img title="read" class="read-btn action-img float-right" onclick="readButton('${data.message.replace(/'/g, "\\'")}');" src="read.png">
        </div
      </li>
    `;
    this.list.innerHTML += html;
  }
}
/* <img title="translate" class="translate-btn action-img mx-1" onclick="translateButton('${data.message}');" src="translate.jpg"></img> */