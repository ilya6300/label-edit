import React, { useEffect, useRef, useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { PropertiesObj } from "./PropertiesObj";
import { Barcode } from "./barcode/Barcode";

export const Label = observer(() => {
  // Класс для контейнера свойств
  const [clsContainer, setClsContainer] = useState(
    "editor_list_obj_container_prop-start"
  );
  const lblRef = useRef(null);
  const objRef = useRef(null);

  // Переменные размера этикетки (холста)
  const [canvasX, setCanvasX] = useState(null);
  const [canvasY, setCanvasY] = useState(null);
  let x, y;

  const handlerBorderError = () => {
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        // console.log(
        //   x - Object.xObj + el.w * Memory.mm >
        //     lblRef.current.getBoundingClientRect().x +
        //       lblRef.current.getBoundingClientRect().width,
        //   y - Object.yObj + el.h * Memory.mm >
        //     lblRef.current.getBoundingClientRect().y +
        //       lblRef.current.getBoundingClientRect().height
        // );
        console.log(
          x, Object.yObj, el.w * Memory.mm,
            lblRef.current.getBoundingClientRect().x, Object.obj.nativeEvent.layerX
        );
        console.log(x - lblRef.current.getBoundingClientRect().x - Object.obj.nativeEvent.layerX)
        if (
          x - Object.xObj < lblRef.current.getBoundingClientRect().x ||
          y - Object.yObj < lblRef.current.getBoundingClientRect().y ||
          x - Object.xObj + el.w * Memory.mm >
            lblRef.current.getBoundingClientRect().x +
              lblRef.current.getBoundingClientRect().width ||
          y - Object.yObj + el.h * Memory.mm >
            lblRef.current.getBoundingClientRect().y +
              lblRef.current.getBoundingClientRect().height
        ) {
          Object.obj.target.style.boxShadow = "0 0 1px 1px var(--error)";
        } else {
          Object.obj.target.style.boxShadow = "none";
        }
      }
    });
    // if (
    //   x - Object.xObj < lblRef.current.getBoundingClientRect().x ||
    //   y - Object.yObj < lblRef.current.getBoundingClientRect().y ||
    //   x - Object.xObj + Object.obj.nativeEvent.target.clientWidth >
    //     lblRef.current.getBoundingClientRect().x +
    //       lblRef.current.getBoundingClientRect().width ||
    //   y - Object.yObj + Object.obj.nativeEvent.target.clientHeight >
    //     lblRef.current.getBoundingClientRect().y +
    //       lblRef.current.getBoundingClientRect().height
    // ) {
    //   Object.obj.target.style.boxShadow = "0 0 1px 1px var(--error)";
    // } else {
    //   Object.obj.target.style.boxShadow = "none";
    // }
  };

  // Считываем и записываем координаты в переменные во время
  const dragOver = (e) => {
    // console.log(Object.obj.this.getBoundingClientRect())
    x = e.clientX;
    y = e.clientY;
    Object.objects.find((el) => {
      if (el.id === Number(Object.obj.target.id)) {
        if (el.editSize === true) {
          Object.getAttrW(x, canvasX);
          Object.getAttrH(y, canvasY);
        }
      }
    });
  };
  // Записываем новые координаты, в конце перетягивания
  const onDragEndFunc = (e) => {
    Object.objects.forEach((el) => {
      if (el.id === Number(Object.obj.target.id)) {
        if (el.editSize !== true) {
          Object.getCoordX(x, canvasX);
          Object.getCoordY(y, canvasY);
          handlerBorderError();
        } else {
          Object.getFlagEditSize(false);
        }
      }
    });
    Object.obj.target.style.display = "block";
  };
  // // При начале перетягивания считываем, координаты на перетаскиваемом объекте
  const onDragStartFunc = (e) => {
    setCanvasX(lblRef.current.getBoundingClientRect().x);
    setCanvasY(lblRef.current.getBoundingClientRect().y);
    Object.obj = e;
    Object.yObj = Object.obj.nativeEvent.offsetY;
    Object.xObj = Object.obj.nativeEvent.offsetX;
    Object.wObj = Object.obj.target.offsetWidth;
    Object.hObj = Object.obj.target.offsetHeight;
    if (
      Object.obj.target.offsetHeight - Object.obj.nativeEvent.offsetY < 5 &&
      Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX < 5
    ) {
      Object.objects.find((el) => {
        if (el.id === Number(Object.obj.target.id)) {
          Object.getFlagEditSize(true);
        }
      });
    } else {
      setTimeout(() => {
        e.target.style.display = "none";
      }, 5);
    }
  };
  // Подсветить при наведение на точки масщтабирования
  const onMouseMoveFunc = (e) => {
    if (e.target.style.boxShadow !== "0 0 1px 1px var(--error)") {
      if (
        e.target.offsetHeight - e.nativeEvent.offsetY < 5 &&
        e.target.offsetWidth - e.nativeEvent.offsetX < 5
      ) {
        e.target.style.boxShadow = " 1px 1px 3px 0px var(--mast-yellow)";
      }
    }
  };
  // Курсор покидает границы объекта
  const onMouseOutFunc = (e) => {
    if (e.target.style.boxShadow !== "0 0 1px 1px var(--error)") {
      e.target.style.boxShadow = "none";
    }
  };
  // Открыть окно с свойствами
  const editBodyFunc = (e) => {
    Object.obj = e;
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.find((el) => {
      if (el.id === Number(reg)) {
        Object.setPropObj(el);
      }
    });
    Memory.updateFlagPropsObj(true);
    Object.obj = e;
    Object.editBody();
    setClsContainer("editor_list_obj_container_prop");
  };
  // Закрытие окошка с свойствами
  const onClickClosedProps = (e) => {
    Object.obj = e;
    if (Memory.properties) {
      let reg = Object.obj.target.id.replace(/\D/gm, "");
      Object.objects.find((el) => {
        if (el.id === Number(reg)) {
          Object.setPropObj(el);
        }
      });
    }
  };

  return (
    <div className="label_container">
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
          onDragEnd={() => onDragEndFunc()}
          onDragOver={(e) => dragOver(e)}
          id="label"
          ref={lblRef}
          style={{
            width: Memory.width_label * Memory.mm + "px",
            height: Memory.height_label * Memory.mm + "px",
            // zIndex: 4,
            borderRadius: Memory.radius_label + "px",
          }}
          className="label"
        >
          {Memory.visible_objects ? (
            Object.objects.map((obj) => (
              <div
                onClick={onClickClosedProps}
                onDoubleClick={editBodyFunc}
                onMouseMove={onMouseMoveFunc}
                onMouseOut={onMouseOutFunc}
                key={obj.id}
                draggable={!obj.editSize ? true : false}
                onDragStart={(e) => onDragStartFunc(e)}
                id={obj.id}
                className={obj.cls}
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
                  // transform: "rotate(" + obj.style.rotate + "deg)",
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

                    // draggable={!obj.editSize ? true : false}
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
      {Memory.properties ? (
        <PropertiesObj
          // setProperties={setProperties}
          clsContainer={clsContainer}
          setClsContainer={setClsContainer}
        />
      ) : (
        <></>
      )}
    </div>
  );
});
