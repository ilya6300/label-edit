import React from "react";
import font_family from "../../style/all_font_family.json";
import { ItemFontFamily } from "./ItemFontFamily";
import Object from "../../store/Object";

export const ListFontFamily = () => {
  // Выбрать шрифт тектса
  const selectFontFamily = (e) => {
    Object.updateFontFamily(e);
  };

  return (
    <ul className="list_font_family">
      {font_family.font_family.map((font) => (
        <ItemFontFamily
          selectFontFamily={selectFontFamily}
          font={font}
          key={font}
        />
      ))}
    </ul>
  );
};
