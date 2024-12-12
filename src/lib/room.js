export class PrivateRoom {
  constructor(user_one, user_two) {
    this.chat_id = this.user_one + this.user_two;
  }

  createRoom() {
    return this.chat_id;
  }

  sendMessage() {}
}
