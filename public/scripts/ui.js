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
    const html = `
      <li class="list-group-item container">
        <div class="user-info-div mr-2 my-1">
          <img class="user-img" src="ninja1.png">
          <span class="username mx-1">${data.username}</span>
          <span class="time">${when}</span>
        </div>
        <p class="message mt-1 ml-5">${data.message}</p>
        <img class="speak-btn user-img" onclick=speakButton('${data.message}') src="speak.png">
      </li>
    `;
    this.list.innerHTML += html;
  }
}