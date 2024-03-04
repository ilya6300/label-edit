import React, { useRef, useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { PropertiesObj } from "./PropertiesObj";
import { Barcode } from "./barcode/Barcode";

export const Label = observer(() => {
  const lblRef = useRef(null);
  const [publicEditSize, setPublicEditSize] = useState(false);

  // Переменные размера этикетки (холста)
  const [canvasX, setCanvasX] = useState(null);
  const [canvasY, setCanvasY] = useState(null);
  let x, y;

  // Считываем и записываем координаты в переменные во время
  const dragOver = (e) => {
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
  // Флаг свойств объекта
  const [properties, setProperties] = useState(false);

  // Записываем новые координаты, в конце перетягивания
  const onDragEndFunc = () => {
    Object.objects.forEach((el) => {
      if (el.id === Number(Object.obj.target.id)) {
        if (el.editSize !== true) {
          Object.getCoordX(x, canvasX);
          Object.getCoordY(y, canvasY);
        } else {
          Object.getFlagEditSize(false);
          setPublicEditSize(false);
        }
      }
    });
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
          setPublicEditSize(true);
        }
      });
    }
  };
  // Подсветить при наведение на точки масщтабирования
  const onMouseMoveFunc = (e) => {
    Object.obj = e;
    if (
      Object.obj.target.offsetHeight - Object.obj.nativeEvent.offsetY < 5 &&
      Object.obj.target.offsetWidth - Object.obj.nativeEvent.offsetX < 5
    ) {
      Object.obj.target.style.borderBottom = "1px solid #e1b82c";
      Object.obj.target.style.borderRight = "1px solid #e1b82c";
    } else {
      Object.obj.target.style.borderBottom = "1px solid";
      Object.obj.target.style.borderRight = "1px solid";
    }
  };
  // Курсор покидает границы объекта
  const onMouseOutFunc = () => {
    Object.obj.target.style.borderBottom = "1px solid";
    Object.obj.target.style.borderRight = "1px solid";
  };

  const editBodyFunc = (e) => {
    Object.obj = e;
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.find((el) => {
      if (el.id === Number(reg)) {
        Object.prop_obj = el;
      }
    });
    setProperties(true);
    Object.obj = e;
    Object.editBody();
    console.log(Object.obj.target);
  };

  return (
    <div className="label_container">
      <div className="label_line">
        <div
          onDragEnd={() => onDragEndFunc()}
          onDragOver={(e) => dragOver(e)}
          id="label"
          ref={lblRef}
          style={{
            width: Memory.width_label * Memory.mm + "px",
            height: Memory.height_label * Memory.mm + "px",
            zIndex: 4,
            borderRadius: Memory.radius_label + "%",
          }}
          className="label"
        >
          {Object.objects.map((obj) => (
            <div
              onDoubleClick={editBodyFunc}
              onMouseMove={onMouseMoveFunc}
              onMouseOut={onMouseOutFunc}
              key={obj.id}
              draggable={!obj.editSize ? true : false}
              onDragStart={(e) => onDragStartFunc(e)}
              id={obj.id}
              ref={obj.refObj}
              className={obj.cls}
              style={{
                width: obj.pxW * Memory.mm + "px",
                height: obj.pxH * Memory.mm + "px",
                zIndex: obj.zIndex,
                left: obj.pxX + "px",
                top: obj.pxY + "px",
                borderBottom: obj.editSize ? "1px solid #e1b82c" : "1px solid",
                borderRight: obj.editSize ? "1px solid #e1b82c" : "1px solid",
              }}
            >
              {obj.typeObj === "text" ? (
                obj.body
              ) : (
                <Barcode
                  body={obj.body}
                  typeBarcode={obj.typeBarcode}
                  w={obj.pxW}
                  h={obj.pxH}
                  id={obj.id}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {properties ? <PropertiesObj setProperties={setProperties} /> : <></>}
    </div>
  );
});
