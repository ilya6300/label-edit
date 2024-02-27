import React, { useEffect, useRef, useState } from "react";
import Memory from "./Memory";

export const Label = () => {
  useEffect(() => {
    // console.log(Memory.mm);
  });
  const lblRef = useRef(null);
  const bcrdRef = useRef(null);

  const [editSize, setEditSize] = useState(false);

  const [model, setModel] = useState([
    {
        id: 1,
        typeObj: 'barcode',
        x: 0,
        y: 0,
        body: 'IIIIiiiIIIIiIII',
        zIndex: 1,
        w: 10,
        h: 10,
    },
    {
        id: 2,
        typeObj: 'text',
        x: 0,
        y: 0,
        body: 'Дата производства',
        zIndex: 1,
        w: 10,
        h: 10,
    },
    {
        id: 3,
        typeObj: 'text',
        x: 0,
        y: 0,
        body: '15.02.2023',
        zIndex: 1,
        w: 10,
        h: 10,
    },
  ])

  const [obj, setObj] =useState(null)
  let x, y;
  let xObj, yObj;
  let w, h;
  let wObj, hObj;
  //   let intervalSize;

  //   Считываем и записываем координаты в переменные во время
  const dragOver = (e, obj) => {
    x = e.nativeEvent.offsetX;
    y = e.nativeEvent.offsetY;
    if (editSize) {
      obj.target.style.width = x - obj.target.offsetLeft + "px";
      obj.target.style.height = y - obj.target.offsetTop + "px";
    }
    // else {
    //   x = e.nativeEvent.offsetX;
    //   y = e.nativeEvent.offsetY;
    // }
  };
  // Записываем новые координаты, в конце перетягивания
  const onDragEndFunc = (obj) => {
    if (!editSize) {
    //   console.log(e.target.id);
      if (x - xObj < 0 || y - yObj < 0) {
        return;
      }
      obj.target.style.left = x - xObj + "px";
      obj.target.style.top = y - yObj + "px";
    }
    setEditSize(false);
  };

  // При начале перетягивания считываем, координаты на перетаскиваемом объекте
  const onDragStartFunc = (e) => {
    if (!editSize) {
      xObj = e.nativeEvent.offsetX;
      yObj = e.nativeEvent.offsetY;
    }
  };
  //

  const onMouseDownFunc = (e) => {
    setObj(e)
    console.log(obj);
    if (e.target.offsetWidth - e.nativeEvent.offsetX < 10) {
      setEditSize(true);
    }
  };

  return (
    <div
      id="label"
      // draggable={!editSize ? true : false}
      onDragEnd={() => onDragEndFunc(obj)}
      onDragOver={(e) => dragOver(e, obj)}
      onDragStart={(e) => onDragStartFunc(e)}
      ref={lblRef}
      style={{
        width: 58 * Memory.mm + "px",
        height: 40 * Memory.mm + "px",
        // borderRadius: "5%",
      }}
      className="label"
    >
      <div
        draggable={!editSize ? true : false}
        ref={bcrdRef}
        onMouseDown={onMouseDownFunc}
        className="boardcode_container"
        style={
          editSize
            ? {
                borderBottom: "2px solid #e1b82c",
                borderRight: "2px solid #e1b82c",
              }
            : {}
        }
      >
        Это штрихкод
      </div>

    </div>
  );
};
