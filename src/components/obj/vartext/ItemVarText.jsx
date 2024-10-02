import React from "react";

export const ItemVarText = (props) => {
  return (
    <li
      onClick={() => props.selectVar(props.variable)}
      className="item_font_family"
    >
      <ul className="sample_font">
        <li
          className="sample_font_name"
          style={{
            fontSize: props.variable.name.length < 20 ? "13px" : "12px",
          }}
        >
          {props.variable.name}
        </li>
        <li>{props.variable.data}</li>
      </ul>
    </li>
  );
};
