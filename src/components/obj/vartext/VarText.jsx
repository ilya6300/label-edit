import React from "react";
import { ListVatText } from "./ListVatText";
import Object from "../../../store/Object";
import Theme from "../../../store/Theme";

export const VarText = ({ setVarText }) => {
  const selectVar = (e) => {
    console.log(e, Object.prop_obj.defaultBody);
    if (Object.prop_obj.defaultBody) {
      Object.editBody(e.data);
      Object.setDefaultBodyBolean(false);
      setVarText(false);
    } else {
      Object.editBody(Object.prop_obj.body + e.data);
      setVarText(false);
    }
  };

  return (
    <ul className="editor_list_obj_container_prop" style={{ border: Theme.theme_border }}>
      <li className="add_obj-title" style={{ borderBottom: Theme.theme_border }}>
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
