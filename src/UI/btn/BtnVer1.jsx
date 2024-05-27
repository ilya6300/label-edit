import React from "react";

export const BtnVer1 = ({ children, ...props }) => {

  return (
    <button className={props.flagPreview ? "btn_ver_1_activ" : "btn_ver_1"} onClick={props.onClick}>
      {children}
    </button>
  );
};
