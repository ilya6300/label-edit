import React from "react";
import Memory from "../../../store/Memory";
import { ItemVarText } from "./ItemVarText";

export const ListVatText = ({selectVar}) => {
  return (
    <ul className="list_font_family">
      {Memory.var_date.map((variable) => (
        <ItemVarText selectVar={selectVar} variable={variable} key={variable.data} />
      ))}
    </ul>
  );
};
