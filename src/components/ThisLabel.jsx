import React, { useEffect, useRef, useState } from "react";
import Memory from "../store/Memory";
import { Barcode } from "./barcode/Barcode";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import keyboard from "../store/keyboard";
import HistoryStore from "../store/HistoryStore";
import { wait } from "@testing-library/user-event/dist/utils";

export const ThisLabel = observer(
  ({ objects, preview, add_canvas, setClsContainer, clsMM }) => {
    //   const refOut = useRef(null);
    const documentMouseUp = () => {
      onMouseUpFunc()
    }
    useEffect(() => {
      document.addEventListener("mouseup", documentMouseUp);
      return () => {
        document.removeEventListener("mouseup", documentMouseUp);
      }
    }, []);
    // Переменные размера этикетки (холста)
    const [canvasX, setCanvasX] = useState(null);
    const [canvasY, setCanvasY] = useState(null);
    let x, y;

    const lblRef = useRef(null);

    const downKey = (e) => {
      if (Object.obj !== null) {
        if (e.key === "Shift") {
          keyboard.trueShift();
        }
      }
    };
    const keyUp = (e) => {
      if (Object.obj !== null) {
        if (e.key === "Shift") {
          keyboard.falseShift();
        }
      }
    };
    useEffect(() => {
      document.addEventListener("keydown", downKey);
      document.addEventListener("keyup", keyUp);
      return () => {
        document.removeEventListener("keydown", downKey);
        document.removeEventListener("keyup", keyUp);
      };
    }, []);

    // Подсветить при наведение на точки масщтабирования
    const onMouseMoveFunc = (e) => {
      if (!preview) {
        x = e.clientX;
        y = e.clientY;
        if (Object.obj !== null) {
          //
          const reg = Object.obj.target.id.replace(/\D/gm, "");

          Object.objects.find((el) => {
            if (el.id === Number(reg)) {
              if (el.editSize === true) {
                Object.getAttributeClone(x, y, lblRef, false);
              } else {
                Object.getCoordClone(
                  x,
                  canvasX,
                  y,
                  canvasY,
                  lblRef,
                  (Object.obj.target.style.visibility = "visible")
                );
              }
            }
          });
          if (e.target.style.boxShadow !== "0 0 1px 1px var(--error)") {
            e.target.style.cursor = "default";
            if (
              e.target.offsetHeight - e.nativeEvent.offsetY < 7 &&
              e.target.offsetWidth - e.nativeEvent.offsetX < 7
            ) {
              e.target.style.cursor = "nwse-resize";
              Object.hoverElementShadow(
                e,
                "1px 1px 3px 0px var(--mast-blue-1)"
              );
            } else if (e.target.offsetHeight - e.nativeEvent.offsetY < 7) {
              e.target.style.cursor = "s-resize";
              Object.hoverElementShadow(e, "0 2px 2px 0px var(--mast-blue-1)");
            } else if (e.target.offsetWidth - e.nativeEvent.offsetX < 7) {
              e.target.style.cursor = "e-resize";
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
        }
      }
    };
    // Курсор покидает границы объекта
    const onMouseOutFunc = () => {
      if (!preview) {
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
      }
    };

    // Открыть окно с свойствами
    const editBodyFunc = (e) => {
      if (!preview) {
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
      }
    };

    const onMouseDownFunc = (e) => {
      if (!preview) {
        // refOut.current.style.display = "block";
        setCanvasX(lblRef.current.getBoundingClientRect().x);
        setCanvasY(lblRef.current.getBoundingClientRect().y);
        Object.getObject(e);
        // pressShift(e);
        const reg = Object.obj.target.id.replace(/\D/gm, "");
        Object.objects.forEach((active) => {
          if (active.id === Number(reg)) {
            if (!active.active) {
              editBodyFunc(e);
              return;
            } else {
              editBodyFunc(e);
              if (
                Object.obj.target.offsetHeight -
                  Object.obj.nativeEvent.offsetY <
                  7 &&
                Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX <
                  7 &&
                !keyboard.shift_key
              ) {
                Object.getFlagEditSize(true, true, true);
              } else if (
                Object.obj.target.offsetHeight -
                  Object.obj.nativeEvent.offsetY <
                7
              ) {
                Memory.calcCoefficientH();
                Object.getFlagEditSize(true, false, true);
              } else if (
                Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX <
                7
              ) {
                Memory.calcCoefficientW();
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
            }
          }
        });
      }
    };

    const onMouseUpFunc = () => {
      if (!preview) {
        if (Object.obj !== null) {
          Object.getFlagEditSize(false);
          Object.getCoordXY();
          Object.saveAttributeWH();
          Object.deleteClone();
          Object.boxShadowObj();
          HistoryStore.addHistory();
        }
      }
    };

    // const onMouseUpHistory = () => {
    //   if (!preview) {
    //     if (Object.obj !== null) {
    //       HistoryStore.addHistory();
    //     }
    //   }
    // };

    return (
      <div
        // onMouseUp={onMouseUpHistory}
        onMouseMove={onMouseMoveFunc}
        id="label"
        style={{
          width: Memory.width_label * Memory.mm + "px",
          height: Memory.height_label * Memory.mm + "px",
          borderRadius: Memory.radius_label + "px",
        }}
        className="label"
      >
        <div className={clsMM}>
          <React.StrictMode>
            <div
              ref={lblRef}
              className="label_reference "
              style={{
                width: Memory.width_label * Memory.mm + "px",
                height: Memory.height_label * Memory.mm + "px",
                borderRadius: Memory.radius_label + "px",
                marginLeft: Memory.ref_x * Memory.mm + "px",
                marginTop: Memory.ref_y * Memory.mm + "px",
                border: !preview ? "var(--grey_border)" : "none",
              }}
            >
              {Memory.visible_objects ? (
                objects.map((obj) => (
                  <div
                    // onDragStart={(e) => e.preventDefault()}
                    // onMouseUp={onMouseUpFunc}
                    onMouseDown={onMouseDownFunc}
                    onMouseOut={onMouseOutFunc}
                    key={obj.id}
                    id={obj.id}
                    className={!preview ? obj.cls.join(" ") : obj.clsPreview}
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

                      opacity:
                        (obj.active && !preview) || (obj.active && preview)
                          ? 1
                          : !obj.active && !preview
                          ? 0.2
                          : 0,
                      boxShadow: !preview ? obj.style.boxShadow : "none",
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
                        add_canvas={add_canvas}
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
          </React.StrictMode>
        </div>
      </div>
    );
  }
);
