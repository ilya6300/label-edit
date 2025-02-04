import React, { useState } from "react";
import Theme from "../../store/Theme";
import { observer } from "mobx-react-lite";

export const BtnVer1 = observer(({ children, ...props }) => {
  const maxWidth = props.maxWidth;
  const maxHeight = props.maxHeight;
  const margin = props.margin;
  const [background, setBackground] = useState(Theme.btn_background_black);
  return (
    <button
      onClick={props.onClick}
      style={{
        background: Theme.black_theme ? Theme.btn_background_black : "none",
        maxWidth: maxWidth,
        minWidth: maxWidth,
        maxHeight: maxHeight,
        minHeight: maxHeight,
        margin: margin,
        color: "#767574",
      }}
      className={[props.flagPreview ? "btn_ver_1_activ" : "btn_ver_1"]}
    >
      {children}
    </button>
  );
});
