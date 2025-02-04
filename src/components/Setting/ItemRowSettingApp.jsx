import React from "react";
import { MyBtnCheckActive } from "../../UI/btn/MyBtnCheckActive";
import { observer } from "mobx-react-lite";

export const ItemRowSettingApp = observer((props) => {
  return (
    <li className="item_row_setting">
      <span>{props.name}</span>
      <MyBtnCheckActive active={props.active} onClick={props.onClick} />
    </li>
  );
});
