import React, { useEffect, useRef, useState } from "react";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import Memory from "../store/Memory";
import { ListFontFamily } from "./obj/ListFontFamily";

export const PropertiesObj = observer(({ setClsContainer, clsContainer }) => {
  const [value, setValue] = useState(Object.prop_obj.body);
  const [fontSize, setFontSize] = useState(Object.prop_obj.style.fontSize);
  // Флаги отображения свойств
  const [flagFontFamily, setFlagFontFamily] = useState(false);
  const [blockTextPosition, setBlockTextPosition] = useState(false);
  const [rotate, setRotate] = useState(false);

  const fontFamilyRef = useRef(null);
  const blockTextPositionRef = useRef(null);
  const rotateRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", closedListFontFamily);
    document.addEventListener("mousedown", closedBlockTextPosition);
    document.addEventListener("mousedown", closedRotateBlock);
  }, []);

  // Закрытие списка с стилями текста
  const closedBlockTextPosition = (e) => {
    if (
      blockTextPositionRef.current &&
      !blockTextPositionRef.current.contains(e.target)
    ) {
      setBlockTextPosition(false);
    }
  };
  const closedListFontFamily = (e) => {
    if (fontFamilyRef.current && !fontFamilyRef.current.contains(e.target)) {
      setFlagFontFamily(false);
    }
  };
  const closedRotateBlock = (e) => {
    if (rotateRef.current && !rotateRef.current.contains(e.target)) {
      setRotate(false);
    }
  };

  // Редактировать боди, установка максимальной длины текста
  const editBodyFunc = (e) => {
    setValue(e.target.value);
    Object.editBody(e.target.value);
  };

  // Закрать свойства объекта
  const closedProperties = () => {
    setClsContainer("editor_list_obj_container_prop_closed");
    setTimeout(() => {
      Memory.updateFlagPropsObj(false);
    }, 1100);
  };

  // сбросить боди текстового объекта и сохранить в буфер
  const resetBody = () => {
    Memory.setTextBuffer();
    Memory.setBufferPropObj();
    Object.editBody("");
    Memory.updateFlagPropsBuffer(true);
  };

  // Восстановить содежимое боди из буфера
  const restoryBody = () => {
    Object.editBody(Memory.buffer_text);
    Memory.updateFlagPropsBuffer(false);
  };

  // Удалить объект
  const deleteObj = () => {
    // Object.setPropObj(null);
    Memory.updateFlagPropsObj(false);
    Object.deleteObject(Object.prop_obj);
  };

  // Изменение размера шрифта у объекта
  const updateFontSizeFunc = (e) => {
    setFontSize(e.target.value);
    Object.updateFontSize(e.target.value);
  };

  // Изменение позиции блока
  const blockAlign = (e) => {
    Object.textAlign(e.target.id);
  };

  // Изменение поворота
  const rotateFunc = (e) => {
    Object.updateRotate(e.target.id);
  };

  return (
    <ul className={clsContainer}>
      <li className="add_obj-title">Свойства:</li>
      <li className="prop_obj">
        <span className="prop_obj_info">Ширина:</span>{" "}
        {Math.round(Object.prop_obj.w)} мм
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">Высота:</span>{" "}
        {Math.round(Object.prop_obj.h)} мм
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">X:</span>{" "}
        {Math.round(Object.prop_obj.x)} мм
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">Y:</span>{" "}
        {Math.round(Object.prop_obj.y)} мм
      </li>
      <li className="prop_obj">
        {rotate ? (
          <span ref={rotateRef} className="prop_obj_position">
            <span
              className="prop_obj_position_span"
              id="0"
              onClick={rotateFunc}
            >
              0
            </span>{" "}
            <span
              className="prop_obj_position_span"
              id="90"
              onClick={rotateFunc}
            >
              90
            </span>{" "}
            <span
              className="prop_obj_position_span"
              id="180"
              onClick={rotateFunc}
            >
              180
            </span>{" "}
            <span
              className="prop_obj_position_span"
              id="270"
              onClick={rotateFunc}
            >
              270
            </span>
          </span>
        ) : (
          <></>
        )}
        <span className="prop_obj_info">Поворот:</span>{" "}
        <span className="prop_obj_info_modal" onClick={() => setRotate(true)}>
          {Math.round(Object.prop_obj.style.rotate)} %
        </span>
      </li>
      {Object.prop_obj.typeObj === "block" ? (
        <li ref={blockTextPositionRef} className="prop_obj">
          <span className="prop_obj_info">Позиция:</span>{" "}
          <label
            onClick={() => setBlockTextPosition(true)}
            className="prop_obj_position_label"
          >
            <span className="prop_obj_info_modal">
              {Object.prop_obj.style.position}
            </span>
            {blockTextPosition ? (
              <span className="prop_obj_position">
                <span
                  className="prop_obj_position_span"
                  id="left"
                  onClick={blockAlign}
                >
                  Лево
                </span>
                <span
                  className="prop_obj_position_span"
                  id="center"
                  onClick={blockAlign}
                >
                  Центр
                </span>
                <span
                  className="prop_obj_position_span"
                  id="right"
                  onClick={blockAlign}
                >
                  Право
                </span>
              </span>
            ) : (
              <></>
            )}
          </label>
        </li>
      ) : (
        <></>
      )}

      {Object.prop_obj.typeObj === "text" ||
      Object.prop_obj.typeObj === "block" ? (
        <>
          {" "}
          <li className="prop_obj">
            <span className="prop_obj_info">Размер :</span>
            <input
              className="prop_obj_font_size"
              type="number"
              value={Object.prop_obj.style.fontSize}
              onChange={updateFontSizeFunc}
            />
          </li>
          <li className="prop_obj">
            Шрифт:{" "}
            <span
              onClick={() => setFlagFontFamily(true)}
              className="prop_obj_font_family"
            >
              {Object.prop_obj.style.fontFamily}
            </span>
          </li>
          {flagFontFamily ? (
            <li>
              <div ref={fontFamilyRef}>
                <ListFontFamily />
              </div>
            </li>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}

      <li>
        {Object.prop_obj.typeObj === "block" ? (
          <textarea
            className="prop_obj-inp"
            type="text"
            value={Object.prop_obj.body}
            onChange={editBodyFunc}
            placeholder="Введите текст"
          ></textarea>
        ) : (
          <input
            className="prop_obj-inp"
            type="text"
            value={Object.prop_obj.body}
            onChange={editBodyFunc}
            placeholder="Введите текст"
          />
        )}
      </li>
      {Object.prop_obj.typeObj === "text" ||
      Object.prop_obj.typeObj === "block" ? (
        <li className="prop_obj-reset_text">
          {Memory.buffer_text_flag &&
          Memory.buffer_obj.id === Object.prop_obj.id ? (
            <span onClick={restoryBody}>Восстановить</span>
          ) : (
            <span onClick={resetBody}>Сбросить текст</span>
          )}
        </li>
      ) : (
        <></>
      )}
      <li className="prop_obj-delete" onClick={deleteObj}>
        Удалить
      </li>
      <li className="prop_obj-closed" onClick={closedProperties}>
        Закрыть
      </li>
    </ul>
  );
});
