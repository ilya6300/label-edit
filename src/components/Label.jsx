import React, { useEffect, useRef, useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { Barcode } from "./barcode/Barcode";
import { NoneProps } from "./NoneProps";
import { PropertiesPanel } from "./PropertiesPanel";
import { PreviewLabel } from "./PreviewLabel";

export const Label = observer(({ flagPreview }) => {
  // Класс для контейнера свойств
  const [clsContainer, setClsContainer] = useState(
    "editor_list_obj_container_prop-start"
  );
  const lblRef = useRef(null);

  const [previewObj, setPreviewObj] = useState(null);
  useEffect(() => {
    setPreviewObj(lblRef.current.cloneNode());
  }, []);

  // Переменные размера этикетки (холста)
  const [canvasX, setCanvasX] = useState(null);
  const [canvasY, setCanvasY] = useState(null);
  let x, y;

  // Подсветить при наведение на точки масщтабирования
  const onMouseMoveFunc = (e) => {
    x = e.clientX;
    y = e.clientY;
    if (Object.obj !== null) {
      //
      const reg = Object.obj.target.id.replace(/\D/gm, "");

      Object.objects.find((el) => {
        if (el.id === Number(reg)) {
          if (el.editSize === true) {
            Object.getAttributeClone(x, y);
          } else {
            Object.getCoordClone(x, canvasX, y, canvasY);
          }
        }
      });
      if (e.target.style.boxShadow !== "0 0 1px 1px var(--error)") {
        if (
          e.target.offsetHeight - e.nativeEvent.offsetY < 7 &&
          e.target.offsetWidth - e.nativeEvent.offsetX < 7
        ) {
          Object.hoverElementShadow(e, "1px 1px 3px 0px var(--mast-blue-1)");
        } else if (e.target.offsetHeight - e.nativeEvent.offsetY < 7) {
          Object.hoverElementShadow(e, "0 2px 2px 0px var(--mast-blue-1)");
        } else if (e.target.offsetWidth - e.nativeEvent.offsetX < 7) {
          Object.hoverElementShadow(e, "2px 0 2px 0px var(--mast-blue-1)");
        }
      }
    }
    if (
      e.clientX - lblRef.current.getBoundingClientRect().x <= 4 ||
      e.clientX - lblRef.current.getBoundingClientRect().x >=
        Math.floor(lblRef.current.getBoundingClientRect().width - 4) ||
      e.clientY - lblRef.current.getBoundingClientRect().y <= 4 ||
      e.clientY - lblRef.current.getBoundingClientRect().y >=
        Math.floor(lblRef.current.getBoundingClientRect().height - 4)
    ) {
      if (Object.obj !== null) {
        Object.obj.target.style.visibility = "visible";
        Object.deleteClone();
      }
    }
  };
  // Курсор покидает границы объекта
  const onMouseOutFunc = () => {
    if (Object.obj !== null) {
      let reg = Object.obj.target.id.replace(/\D/gm, "");
      Object.objects.forEach((el) => {
        if (el.id === Number(reg)) {
          if (
            el.style.boxShadow === "0 0 1px 1px var(--error)" ||
            el.style.boxShadow === "#1d8306 0px 0px 3px 2px"
          ) {
            return;
          } else {
            Object.hoverElementShadow(Object.obj, "none");
          }
        } else {
          if (el.style.boxShadow === "0 0 1px 1px var(--error)") {
            return;
          } else {
            Object.hoverElementShadow(Object.obj, "none");
          }
        }
      });
    }
  };
  //
  const handlerBorderError = () => {
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        if (
          (el.w >= el.h && el.pxX < 0) ||
          (el.w < el.h && el.pxX < 0) ||
          (el.w >= el.h && el.pxY < 0) ||
          (el.w < el.h && el.pxW / 2 - el.pxX < 0) ||
          (el.w >= el.h &&
            el.pxX + el.w * Memory.mm >
              lblRef.current.getBoundingClientRect().width) ||
          (el.w < el.h &&
            el.w * 2 * Memory.mm + el.pxX >
              lblRef.current.getBoundingClientRect().width) ||
          (el.w >= el.h &&
            el.pxY + el.h * Memory.mm >
              lblRef.current.getBoundingClientRect().height) ||
          (el.w < el.h &&
            el.pxY / 2 + el.h * Memory.mm >
              lblRef.current.getBoundingClientRect().height)
        ) {
          el.style.boxShadow = "0 0 1px 1px var(--error)";
        }
      }
    });
  };
  // Открыть окно с свойствами
  const editBodyFunc = (e) => {
    Object.getObject(e);
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.find((el) => {
      if (el.id === Number(reg)) {
        Object.setPropObj(el);
      }
    });
    Memory.updateFlagPropsObj(true);
    Object.editBody();
    setClsContainer("editor_list_obj_container_prop");
  };

  const onMouseDownFunc = (e) => {
    refOut.current.style.display = "block";
    setCanvasX(lblRef.current.getBoundingClientRect().x);
    setCanvasY(lblRef.current.getBoundingClientRect().y);
    Object.getObject(e);
    const reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.forEach((active) => {
      if (active.id === Number(reg)) {
        if (!active.active) {
          editBodyFunc(e);
          return;
        } else {
          editBodyFunc(e);
          if (
            Object.obj.target.offsetHeight - Object.obj.nativeEvent.offsetY <
              7 &&
            Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX < 7
          ) {
            Object.getFlagEditSize(true, true, true);
          } else if (
            Object.obj.target.offsetHeight - Object.obj.nativeEvent.offsetY <
            7
          ) {
            Object.getFlagEditSize(true, false, true);
          } else if (
            Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX <
            7
          ) {
            Object.getFlagEditSize(true, true, false);
          }
          // else {
          Object.objects.forEach((el) => {
            let reg = Object.obj.target.id.replace(/\D/gm, "");
            if (el.id === Number(reg)) {
              const clone_obj = { ...el };
              clone_obj.id = 9999;
              clone_obj.zIndex = 1;
              Object.addObj(clone_obj);
            }
          });
          Object.obj.target.style.visibility = "hidden";
        }
      }
    });
  };

  const onMouseUpFunc = () => {
    if (Object.obj !== null) {
      Object.obj.target.style.visibility = "visible";
      Object.getFlagEditSize(false);
      Object.getCoordXY();
      Object.saveAttributeWH();
      handlerBorderError();
      Object.deleteClone();
      refOut.current.style.display = "none";
      Object.boxShadowObj();
    }
  };

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
      {!flagPreview ? <PreviewLabel previewObj={previewObj} /> : <></>}
      <div className="out_contaiber" onMouseMove={outLabel} ref={refOut}></div>
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
            marginTop: -Memory.height_label * Memory.mm + 20 + "px",
            height: Memory.height_label * Memory.mm + "px",
            width: Memory.width_label * Memory.mm + "px",
            borderRadius: Memory.radius_label + "px",
            marginBottom: Memory.gap * Memory.mm + "px",
          }}
        ></div>
        <div
          onMouseUp={onMouseUpFunc}
          onMouseMove={(e) => onMouseMoveFunc(e)}
          id="label"
          ref={lblRef}
          style={{
            width: Memory.width_label * Memory.mm + "px",
            height: Memory.height_label * Memory.mm + "px",
            borderRadius: Memory.radius_label + "px",
          }}
          className="label"
        >
          {Memory.visible_objects ? (
            Object.objects.map((obj) => (
              <div
                onDragStart={(e) => e.preventDefault()}
                onMouseUp={onMouseUpFunc}
                onMouseDown={onMouseDownFunc}
                onMouseOut={onMouseOutFunc}
                key={obj.id}
                id={obj.id}
                className={obj.cls.join(" ")}
                style={{
                  width:
                    obj.typeObj === "text"
                      ? "fit-content"
                      : obj.pxW * Memory.mm + "px",
                  height: obj.pxH * Memory.mm + "px",
                  zIndex: obj.zIndex,
                  left: obj.pxX + "px",
                  top: obj.pxY + "px",
                  fontSize: obj.style.fontSize + "pt",
                  fontFamily: obj.style.fontFamily,
                  justifyContent: obj.style.position,
                  rotate: obj.style.rotate + "deg",
                  opacity: obj.active ? 1 : 0.2,
                  boxShadow: obj.style.boxShadow,
                }}
              >
                {obj.typeObj === "text" || obj.typeObj === "block" ? (
                  obj.body
                ) : (
                  <></>
                )}
                {obj.typeObj === "barcode" ? (
                  <Barcode
                    body={obj.body}
                    typeBarcode={obj.typeBarcode}
                    w={obj.pxW}
                    h={obj.pxH}
                    id={obj.id}
                    active={obj.active}
                  />
                ) : (
                  <></>
                )}
                {obj.typeObj === "img" ? (
                  <img
                    id={obj.id}
                    style={{
                      width: obj.pxW * Memory.mm + "px",
                      height: obj.pxH * Memory.mm + "px",
                      border: "none",
                      left: obj.pxX + "px",
                      top: obj.pxY + "px",
                    }}
                    src={obj.body}
                    alt=""
                  />
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
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
      {Object.obj !== null ? (
        <PropertiesPanel clsContainer={clsContainer} />
      ) : (
        <NoneProps />
      )}
    </div>
  );
});
