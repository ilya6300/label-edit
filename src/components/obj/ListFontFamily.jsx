import React from "react";
import { ItemFontFamily } from "./ItemFontFamily";
import Object from "../../store/Object";
import Fonts from "../../store/Fonts";
import { observer } from "mobx-react-lite";

export const ListFontFamily = observer(({selectFontFamily}) => {
  // Выбрать шрифт тектса
  const hoverFontFamily = (e) => {
    Object.updateFontFamily(e.name);
  };

  return (
    <ul className="list_font_family">
      {Fonts.fonts.map((font) => (
        <ItemFontFamily
          selectFontFamily={selectFontFamily}
          hoverFontFamily={hoverFontFamily}
          font={font}
          key={font.id}
        />
      ))}
    </ul>
  );
});
