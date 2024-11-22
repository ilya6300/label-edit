import React from "react";
import { observer } from "mobx-react-lite";
import { ThisLabel } from "./ThisLabel";
import Memory from "../store/Memory";
import Object from "../store/Object";
import Theme from "../store/Theme";

export const PreviewLabel = observer(({ setFlagPrevier, clsMM }) => {
  let x, y;
  const onDragEndFunc = (e) => {
    e.target.style.left = e.clientX - x + "px";
    e.target.style.top = e.clientY - y + "px";
  };

  const getStartCoord = (e) => {
    x = e.nativeEvent.layerX;
    y = e.nativeEvent.layerY;
  };

  const decrementScaleFunc = () => {
    Memory.decrementScale();
  };
  const incrementScaleFunc = () => {
    Memory.incrementScale();
  };
  const resetScaleFunc = () => {
    Memory.resetScale();
  };

  return (
    <div
      className="preview_label_container"
      draggable={true}
      onDragEnd={onDragEndFunc}
      onMouseDown={getStartCoord}
      style={{
        width:
          Memory.width_label *
            Memory.mm *
            Memory.scales[Memory.scale_preview_index].scale +
          10 +
          "px",
        height:
          Memory.height_label *
            Memory.mm *
            Memory.scales[Memory.scale_preview_index].scale +
          60 +
          "px",
        background: Theme.background,
      }}
    >
      <div className="preview_label_container_reletive">
        <div className="preview_label_block">
          <div className="nav_preview">
            <div className="preview_label_title">Окно предпросмотра</div>
            <span
              className="container_closed_btn-blue"
              onClick={() => setFlagPrevier(false)}
            ></span>
          </div>
          <div className="preview_label_scale_container">
            <span className="preview_label_title">Масштаб: </span>
            <span className="preview_label_title">
              {Memory.scales[Memory.scale_preview_index].text}
            </span>
            <span
              className="preview_label_title preview_btn"
              onClick={decrementScaleFunc}
            >
              -
            </span>
            <span
              className="preview_label_title preview_btn"
              onClick={incrementScaleFunc}
            >
              +
            </span>
            <span className="preview_label_title" onClick={resetScaleFunc}>
              сброс
            </span>
          </div>
          <div
            className="preview_label_window"
            style={{
              rotate: Memory.DIRECTION_1 === 0 ? "0deg" : "180deg",
              transform:
                Memory.DIRECTION_2 === 0 ? "scale(1, 1)" : "scale(-1, 1)",
              scale: String(Memory.scales[Memory.scale_preview_index].scale),
            }}
          >
            <div
              className="absolute"
              style={{
                rotate: "180deg",
                top:
                  Memory.DIRECTION_1 === 1
                    ? -(Memory.height_label * Memory.mm) + "px"
                    : 0,
              }}
            >
              <ThisLabel
                clsMM={clsMM}
                objects={Object.objects}
                preview={true}
                add_canvas="a"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
