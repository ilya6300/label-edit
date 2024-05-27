import React from "react";

export const LabelInpVer1 = (props) => {
  return (
    <label>
      {props.text}:
      <input
        className="barlabel_number"
        type="number"
        value={props.value}
        onChange={props.onChange}
      />
    </label>
  );
};
