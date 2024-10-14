import React, { useRef, useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { NoneProps } from "./NoneProps";
import { PropertiesPanel } from "./PropertiesPanel";
import { PreviewLabel } from "./PreviewLabel";
import { ThisLabel } from "./ThisLabel";

export const Label = observer(({ flagPreview, setFlagPrevier, clsMM }) => {
  // Класс для контейнера свойств
  const [clsContainer, setClsContainer] = useState(
    "editor_list_obj_container_prop-start"
  );

  const refOut = useRef(null);

  const outLabel = (e) => {
    if (Object.obj !== null) {
      Object.obj.target.style.visibility = "visible";
      Object.deleteClone();
    }
    refOut.current.style.display = "none";
  };

  return (
    <div className="label_container">
      <div className="out_contaiber" onMouseMove={outLabel} ref={refOut}></div>
      <div className="label_container_label">
        <div
          className="label_line"
          style={{
            height:
              Memory.height_label > 43
                ? 40 +
                  Memory.height_label * Memory.mm +
                  Memory.gap * Memory.mm * 2 +
                  "px"
                : 460 + "px",
            minHeight: 460 + "px",
          }}
        >
          <div
            className="label"
            style={{
              marginTop:
                (-Memory.height_label * Memory.mm + 20) * Memory.scale + "px",
              height: Memory.height_label * Memory.mm * Memory.scale + "px",
              width: Memory.width_label * Memory.mm * Memory.scale + "px",
              borderRadius: Memory.radius_label + "px",
              marginBottom: Memory.gap * Memory.mm + "px",
            }}
          ></div>

          <ThisLabel
            clsMM={clsMM}
            objects={Object.objects}
            setClsContainer={setClsContainer}
          />

          {Memory.height_label > 75 ? (
            <div
              className="label"
              style={{
                position: "absolute",
                top:
                  20 +
                  Memory.height_label * Memory.mm +
                  Memory.gap * Memory.mm * 2 +
                  "px",
                height: Memory.height_label * Memory.mm + "px",
                width: Memory.width_label * Memory.mm + "px",
                borderRadius: Memory.radius_label + "px",
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {Object.obj !== null ? (
        <PropertiesPanel clsContainer={clsContainer} />
      ) : (
        <NoneProps />
      )}
      {flagPreview ? (
        <PreviewLabel clsMM={clsMM} setFlagPrevier={setFlagPrevier} />
      ) : (
        <></>
      )}
    </div>
  );
});
