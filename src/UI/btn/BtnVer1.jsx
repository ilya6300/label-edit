import React from "react";
import Theme from "../../store/Theme";
import { observer } from "mobx-react-lite";

export const BtnVer1 = observer(({ children, ...props }) => {
  return (
    <button
      onClick={props.onClick}
      style={{
        background: Theme.black_theme ? Theme.btn_background_black : "none",
      }}
      className={props.flagPreview ? "btn_ver_1_activ" : "btn_ver_1"}
    >
      {children}
    </button>
  );
});
