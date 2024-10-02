import React from "react";
import Msg from "../../store/Msg";
import { ItemMessage } from "./ItemMessage";
import { observer } from "mobx-react-lite";

export const MessagesContainer = observer(() => {
  return (
    <div className="messages_container">
      {Msg.messages.map((msg) => (
        <ItemMessage key={msg.id_message} msg={msg} />
      ))}
    </div>
  );
});
