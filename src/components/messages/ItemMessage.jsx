import React from "react";
import Msg from "../../store/Msg";
import { observer } from "mobx-react-lite";

export const ItemMessage = observer((props) => {
  const deleteMsg = () => {
    console.log(props.msg)
    Msg.deleteMessage(props.msg);
  };
  return (
    <div className="item_message">
      <p>{props.msg.message}</p>
      <span className="item_message-closed" onClick={deleteMsg}>
        x
      </span>
    </div>
  );
});
