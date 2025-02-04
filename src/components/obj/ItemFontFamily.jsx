import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Object from "../../store/Object";

export const ItemFontFamily = observer((props) => {
  useEffect(() => {
    if (props.font.data === undefined) return;
  }, []);

  return (
    <li
      className="item_font_family"
      style={{
        border:
          Object.prop_obj.style.fontFamily === props.font.name
            ? "1px solid var(--mast-blue-1)"
            : "",
      }}
      onClick={() => props.selectFontFamily(props.font)}
      onMouseMove={() => props.hoverFontFamily(props.font)}
    >
      <div
        className="sample_font"
        style={{
          fontFamily: props.font.name,
        }}
      >
        <span
          className="sample_font_name"
          style={{
            fontSize: props.font.name.length < 20 ? "13px" : "12px",
          }}
        >
          {props.font.name}
        </span>
        Это образец шрифта <br /> This is a sample font
        <br /> 0123456789
      </div>
    </li>
  );
});
