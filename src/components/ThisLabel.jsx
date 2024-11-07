import React, { useEffect, useRef, useState } from "react";
import Memory from "../store/Memory";
import { Barcode } from "./barcode/Barcode";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import keyboard from "../store/keyboard";
import HistoryStore from "../store/HistoryStore";

export const ThisLabel = observer(
  ({ objects, preview, add_canvas, setClsContainer, clsMM }) => {
    const documentMouseUp = () => {
      onMouseUpFunc();
    };
    useEffect(() => {
      document.addEventListener("mouseup", documentMouseUp);
      return () => {
        document.removeEventListener("mouseup", documentMouseUp);
      };
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
          Memory.flagMoveCoord(true);
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
            } else if (
              e.target.offsetHeight - e.nativeEvent.offsetY < 7 &&
              e.target.innerText !== "lines"
            ) {
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
      if (!preview && e.target.id !== "btn_size") {
        Object.getObject(e);
        let reg = Object.obj.target.id.replace(/\D/gm, "");
        const ID = Object.objects.find((el) => el.id === Number(reg));
        if (ID) {
          Object.setPropObj(ID);
        }
        Memory.updateFlagPropsObj(true);
        Object.editBody();
        setClsContainer("editor_list_obj_container_prop");
      }
    };

    const onMouseDownFunc = (e) => {
      if (!preview && e.target.id !== "btn_size") {
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
                Object.obj.target.offsetHeight -
                  Object.obj.nativeEvent.offsetY <
                  7 &&
                Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX <
                  7 &&
                !keyboard.shift_key &&
                e.target.innerText !== "lines"
              ) {
                Object.getFlagEditSize(true, true, true);
              } else if (
                Object.obj.target.offsetHeight -
                  Object.obj.nativeEvent.offsetY <
                  7 &&
                e.target.innerText !== "lines"
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

    const scaleBarcodeIncrement = () => {
      if (
        (Object.prop_obj.typeBarcode === "ean13" ||
          Object.prop_obj.typeBarcode === "code128") &&
        Object.prop_obj.w + 1 < 5
      ) {
        Object.manualW(Object.prop_obj.w + 1);
      } else if (
        Object.prop_obj.typeBarcode === "datamatrix" &&
        Object.prop_obj.w + 1 < 23
      ) {
        Object.manualW(Object.prop_obj.w + 1);
      }
    };
    const scaleBarcodeDecrement = () => {
      if (
        Object.prop_obj.typeBarcode === "ean13" ||
        (Object.prop_obj.typeBarcode === "code128" && Object.prop_obj.w - 1 > 0)
      ) {
        Object.manualW(Object.prop_obj.w - 1);
      } else if (
        Object.prop_obj.typeBarcode === "datamatrix" &&
        Object.prop_obj.w - 1 > 2
      ) {
        Object.manualW(Object.prop_obj.w - 1);
      }
    };

    const onMouseUpFunc = (e) => {
      if (!preview) {
        if (Object.obj !== null) {
          Object.getCoordXY();
          Object.getFlagEditSize(false);
          Object.saveAttributeWH();

          Object.deleteClone();
          Object.boxShadowObj();
          HistoryStore.addHistory();
        }
      }
    };

    return (
      <div
        onMouseMove={onMouseMoveFunc}
        id="label"
        style={{
          width: Memory.width_label * Memory.mm * Memory.scale + "px",
          height: Memory.height_label * Memory.mm * Memory.scale + "px",
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
                width:
                  (Memory.width_label * Memory.mm + 8) * Memory.scale + "px",
                height:
                  (Memory.height_label * Memory.mm + 8) * Memory.scale + "px",
                borderRadius: Memory.radius_label + "px",
                marginLeft: Memory.ref_x * Memory.mm - 8 + "px",
                marginTop: Memory.ref_y * Memory.mm - 8 + "px",
                border: !preview ? "var(--grey_border)" : "none",
              }}
            ></div>
            {Memory.visible_objects ? (
              objects.map((obj) => (
                <div
                  onMouseDown={onMouseDownFunc}
                  onMouseOut={onMouseOutFunc}
                  key={obj.id}
                  id={obj.id}
                  className={!preview ? obj.cls.join(" ") : obj.clsPreview}
                  style={{
                    width:
                        obj.typeBarcode === "datamatrix"
                        ? obj.pxW * obj.min_size * Memory.mm * Memory.scale +
                          "px"
                        : obj.typeObj === "box"
                        ? obj.pxW * Memory.mm * Memory.scale + "px"
                        : obj.pxW * Memory.mm * Memory.scale + "px",
                    height:
                      obj.typeBarcode === "datamatrix"
                        ? obj.pxW * obj.min_size * Memory.mm * Memory.scale +
                          "px"
                        : obj.typeObj === "box"
                        ? obj.pxH * Memory.mm * Memory.scale + "px"
                        : obj.pxH * Memory.mm * Memory.scale + "px",
                    zIndex: obj.zIndex,
                    left:
                      obj.typeObj === "lines" ||
                      obj.typeObj === "box" ||
                       obj.typeObj === "img" ||
                      obj.typeBarcode === "datamatrix" ||
                      obj.typeBarcode === "qr"
                        ? obj.pxX * Memory.scale + "px"
                        : obj.pxFakeX * Memory.scale + "px",
                    top:
                      obj.typeObj === "lines" ||
                      obj.typeObj === "box" ||
                      obj.typeObj === "img" ||
                      obj.typeBarcode === "datamatrix" ||
                      obj.typeBarcode === "qr"
                        ? obj.pxY * Memory.scale + "px"
                        : obj.pxFakeY * Memory.scale + "px",
                    fontSize: obj.style.fontSize * Memory.scale + "pt",
                    fontFamily: obj.style.fontFamily,
                    justifyContent:
                      obj.style.position === "2"
                        ? "center"
                        : obj.style.position === "3"
                        ? "flex-end"
                        : "flex-start",
                    rotate:
                      obj.typeObj !== "lines"
                        ? obj.style.rotate + "deg"
                        : obj.style.rotate,

                    opacity:
                      (obj.active && !preview) || (obj.active && preview)
                        ? 1
                        : !obj.active && !preview
                        ? 0.2
                        : 0,
                    boxShadow: !preview ? obj.style.boxShadow : "none",
                  }}
                >
                  {obj.typeBarcode !== "qrcode" &&
                  obj.typeObj === "barcode" &&
                  obj.id === Object.prop_obj.id &&
                  !preview ? (
                    <div className="barcode_panel_scale_container">
                      <button
                        id="btn_size"
                        className="barcode_panel_scale_btn"
                        onClick={scaleBarcodeIncrement}
                      >
                        +
                      </button>
                      <button
                        id="btn_size"
                        className="barcode_panel_scale_btn"
                        onClick={scaleBarcodeDecrement}
                      >
                        -
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {obj.typeObj === "text" || obj.typeObj === "block" ? (
                    obj.body
                  ) : (
                    <></>
                  )}
                  {obj.typeObj === "barcode" ? (
                    <Barcode obj={obj} add_canvas={add_canvas} />
                  ) : (
                    <></>
                  )}
                  {obj.typeObj === "img" ? (
                    <img
                      id={obj.id}
                      style={{
                        pointerEvents: "none",
                        width: obj.pxW * Memory.mm * Memory.scale + "px",
                        height: obj.pxH * Memory.mm * Memory.scale + "px",
                        border: "none",
                        left: obj.pxX * Memory.scale + "px",
                        top: obj.pxY * Memory.scale + "px",
                      }}
                      src={"data:image/bmp;base64," + obj.body}
                      alt="img"
                    />
                  ) : (
                    <></>
                  )}
                  {obj.typeObj === "lines" ? (
                    <div
                      style={{
                        width: obj.pxW * Memory.mm * Memory.scale + "px",
                        height: obj.pxH * Memory.mm * Memory.scale + "px",
                        background: "black",
                      }}
                      id={obj.id}
                    >
                      {obj.body}
                    </div>
                  ) : (
                    <></>
                  )}
                  {obj.typeObj === "box" ? (
                    <div
                      style={{
                        width: obj.pxW * Memory.mm * Memory.scale + "px",
                        height: obj.pxH * Memory.mm * Memory.scale + "px",
                        border: obj.line_thickness / 2 + "px solid",
                        left: obj.pxX * Memory.scale + "px",
                        top: obj.pxY * Memory.scale + "px",
                        borderRadius: obj.borderRadius / 2 + "px",
                      }}
                      id={obj.id}
                    ></div>
                  ) : (
                    <></>
                  )}
                </div>
              ))
            ) : (
              <></>
            )}
          </React.StrictMode>
        </div>
      </div>
    );
  }
);
