import React, { useState } from "react";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import Memory from "../store/Memory";

export const PropertiesObj = observer(({ setProperties }) => {
  const [value, setValue] = useState(Object.prop_obj.body);

  const editBodyFunc = (e) => {
    setValue(e.target.value);
    Object.editBody(e.target.value);
  };

  return (
    <ul className="properties_container">
      <li>Свойства:</li>
      <li>Ширина: {Object.prop_obj.w}</li>
      <li>Высота: {Object.prop_obj.h}</li>
      <li>X: {Object.prop_obj.x}</li>
      <li>Y: {Object.prop_obj.y}</li>
      <li>
        <input
          type="text"
          value={Object.prop_obj.body}
          onChange={editBodyFunc}
          placeholder={Object.prop_obj.body}
        />
      </li>
      <li onClick={() => setProperties(false)}>Закрыть</li>
    </ul>
  );
});
