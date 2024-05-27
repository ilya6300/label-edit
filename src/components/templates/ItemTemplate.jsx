import { observer } from "mobx-react-lite";
import React from "react";

export const ItemTemplate = observer((props) => {
  return (
    <div className="item_template" onClick={() => props.selectedTemplate(props.template)}>
      {props.template.name} {props.template.width_mm} * {props.template.height_mm}{" "}
    </div>
  );
});
