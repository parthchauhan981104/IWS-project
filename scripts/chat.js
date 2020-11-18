class Chatroom {
  constructor(room, username){
    this.room = room;
    this.username = username;
    this.chats = db.collection('chats');
    this.unsub;
  }
  async addChat(message){
    // format a chat object
    const now = new Date();
    const chat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(now)
      //convert Date object into a firestore timestamp
    };
    // save the chat document
    const response = await this.chats.add(chat);
    return response;
  }
  getChats(callback){
    this.unsub = this.chats
      .where('room', '==', this.room)
      .orderBy('created_at')  //requires a index to be created on the databse
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type === 'added'){
            callback(change.doc.data());
          }
        });
    });
  }
  updateName(username){
    this.username = username;
    localStorage.username = username;
  }
  updateRoom(room){
    this.room = room;
    console.log('room updated');
    if(this.unsub){ // unsub the realtime listener first as its still listening for old room
      this.unsub();
    }
  }
}