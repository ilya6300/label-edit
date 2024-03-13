import React from "react";

export const ItemFontFamily = (props) => {
  return (
    <li className="item_font_family" onClick={() => props.selectFontFamily(props.font)}>{props.font}</li>
  );
};
