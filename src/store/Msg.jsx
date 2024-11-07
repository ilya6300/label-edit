import { makeAutoObservable, toJS } from "mobx";

class Message {
  constructor() {
    makeAutoObservable(this);
  }
  // Сообщения
  messageVisible = true;

  id_message = 0;

  messages = [];

  // message
  writeMessages = (message) => {
    const dublicate = this.messages.find(
      (m) =>
        m.message ===
        message
          .replace(/[{}"']/gm, "")
          .replace(/[:]/gm, ": ")
          .replace(/,/gm, ", ")
    );
    if (!dublicate) {
    this.id_message = this.id_message + 1;
    this.messages = [
      ...this.messages,
      {
        id_message: this.id_message,
        message: message
          .replace(/[{}"']/gm, "")
          .replace(/[:]/gm, ": ")
          .replace(/,/gm, ", "),
      },
    ];
  }
  };

  deleteMessage = (id) => {
    this.messages = this.messages.filter((m) => m.id_message !== id.id_message);
  };
}

export default new Message();
