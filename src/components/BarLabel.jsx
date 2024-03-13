import React, { useState } from "react";
import Memory from "../store/Memory";
import { observer } from "mobx-react-lite";
import Object from "../store/Object";

export const BarLabel = observer(() => {
  const [wValuse, setWValue] = useState(Memory.width_label);
  const [hValuse, setHValue] = useState(Memory.height_label);
  const [rValuse, setRValue] = useState(Memory.radius_label);
  const [gValuse, setGValue] = useState(Memory.gap);

  const changeW = (e) => {
    if (e.target.value > 150) {
      setWValue(150);
      Memory.widthLabelChange(150);
    } else {
      setTimeout(() => {
        if (e.target.value < 15) {
          setWValue(15);
          Memory.widthLabelChange(15);
        }
      }, 1000);
      setWValue(e.target.value);
      Memory.widthLabelChange(e.target.value);
    }
  };
  const changeH = (e) => {
    if (e.target.value > 400) {
      setHValue(400);
      Memory.heigthLabelChange(400);
    } else {
      setTimeout(() => {
        if (e.target.value < 15) {
          setHValue(15);
          Memory.heigthLabelChange(15);
        }
      }, 1000);
      setHValue(e.target.value);
      Memory.heigthLabelChange(e.target.value);
    }
  };
  const changeR = (e) => {
    if (e.target.value > 50) {
      setRValue(50);
      Memory.radiusLabelChange(50);
    } else if (e.target.value <= 0) {
      setRValue(0);
      Memory.radiusLabelChange(0);
    } else {
      setRValue(e.target.value);
      Memory.radiusLabelChange(e.target.value);
    }
  };

  const changeG = (e) => {
    setGValue(e.target.value);
    Memory.gapLabelChange(e.target.value);
  };

  const reset = () => {
    Object.reset();
    Memory.updateFlagPropsObj(false);
    Object.setPropObj(null);
  };

  return (
    <div className="bar_label">
      <span className="barlabel_title">Параметры этикетки</span>
      <label>
        Ширина:{" "}
        <input
          min="15"
          className="barlabel_number"
          type="number"
          value={wValuse}
          onChange={(e) => changeW(e)}
        />
      </label>
      <label>
        Высота:{" "}
        <input
          min="15"
          className="barlabel_number"
          type="number"
          value={hValuse}
          onChange={(e) => changeH(e)}
        />
      </label>
      <label>
        Скругление:{" "}
        <input
          className="barlabel_number"
          type="number"
          value={rValuse}
          onChange={(e) => changeR(e)}
        />
      </label>
      <label>
        Зазор:{" "}
        <input
          className="barlabel_number"
          type="number"
          value={gValuse}
          onChange={(e) => changeG(e)}
        />
      </label>
      <span onClick={reset} className="barlabel_reset_editor">
        Очистить
      </span>
    </div>
  );
});
