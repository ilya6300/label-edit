import { observer } from "mobx-react-lite";
import React from "react";

export const ItemImg = observer((props) => {
  return (
    <div
      className="img_item_container"
      onClick={() => props.getThisImg(props.img)}
    >
      <img className="img_item" src={'data:image/bmp;base64,'+props.img.data} alt="" />
      <p
        className="img_item_text"
        style={{
          fontSize: props.img.name.length < 10 ? "12px" : "9px",
        }}
      >
        {props.img.name}
      </p>
    </div>
  );
});
