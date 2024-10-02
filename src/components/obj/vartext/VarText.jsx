import React from "react";
import { ListVatText } from "./ListVatText";
import Object from "../../../store/Object";

export const VarText = ({ setVarText }) => {
  const selectVar = (e) => {
    Object.editBody(Object.prop_obj.body + e.data);
    setVarText(false);
  };

  return (
    <ul className="editor_list_obj_container_prop">
      <li className="add_obj-title">
        {" "}
        Переменные{" "}
        <span
          className="container_closed_btn"
          onClick={() => setVarText(false)}
        ></span>
      </li>
      <ListVatText selectVar={selectVar} />
    </ul>
  );
};
