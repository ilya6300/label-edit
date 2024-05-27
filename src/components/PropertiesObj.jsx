import React, { useEffect, useRef, useState } from "react";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import Memory from "../store/Memory";
import HistoryStore from "../store/HistoryStore";
// import Fonts from "../store/Fonts";
// import { FontsContainer } from "./obj/FontsContainer";

export const PropertiesObj = observer(({ setFlagFonts, inputPropRef }) => {
  // Переменные свойств
  const [valueX, setValueX] = useState(Object.prop_obj.x);
  const [valueY, setValueY] = useState(Object.prop_obj.y);
  const [valueW, setValueW] = useState(Object.prop_obj.w);
  const [valueH, setValueH] = useState(Object.prop_obj.h);
  const [value, setValue] = useState(Object.prop_obj.body);
  const [fontSize, setFontSize] = useState(Object.prop_obj.style.fontSize);
  const [newName, setNewName] = useState(Object.prop_obj.name);
  // Флаги отображения свойств
  // const [flagFontFamily, setFlagFonts] = useState(false);
  const [blockTextPosition, setBlockTextPosition] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [nameFlag, setNameFlag] = useState(false);

  // const fontFamilyRef = useRef(null);
  const blockTextPositionRef = useRef(null);
  const rotateRef = useRef(null);


  useEffect(() => {
    // console.log(Fonts.default_font.name)
    // document.addEventListener("mousedown", closedListFontFamily);
    document.addEventListener("mousedown", closedBlockTextPosition);
    document.addEventListener("mousedown", closedRotateBlock);
  }, []);
  useEffect(() => {
    setNewName(Object.prop_obj.name);
  }, [Object.prop_obj.name]);

  // Закрытие списка с стилями текста
  const closedBlockTextPosition = (e) => {
    if (
      blockTextPositionRef.current &&
      !blockTextPositionRef.current.contains(e.target)
    ) {
      setBlockTextPosition(false);
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

  // сбросить боди текстового объекта и сохранить в буфер
  const resetBody = () => {
    Memory.setTextBuffer();
    Memory.setBufferPropObj();
    Object.editBody("");
    Memory.updateFlagPropsBuffer(true);
    HistoryStore.addHistory();
  };

  // Восстановить содежимое боди из буфера
  const restoryBody = () => {
    Object.editBody(Memory.buffer_text);
    Memory.updateFlagPropsBuffer(false);
    HistoryStore.addHistory();
  };

  // Удалить объект
  const deleteObj = () => {
    Memory.updateFlagPropsObj(false);
    Object.deleteObject(Object.prop_obj);
    HistoryStore.addHistory();
  };

  // Изменение размера шрифта у объекта
  const updateFontSizeFunc = (e) => {
    setFontSize(e.target.value);
    Object.updateFontSize(e.target.value);
    HistoryStore.addHistory();
  };

  // Изменение позиции блока
  const blockAlign = (e) => {
    Object.textAlign(e.target.id);
    HistoryStore.addHistory();
  };

  // Изменение поворота
  const rotateFunc = (e) => {
    Object.updateRotate(e.target.id);
    HistoryStore.addHistory();
  };
  // Записать имя
  const saveNewName = () => {
    if (!nameFlag) {
      setNameFlag(true);
    } else {
      console.log(nameFlag);
      setNameFlag(false);
      Object.saveName(newName);
    }
    HistoryStore.addHistory();
  };
  // Активировать или деактивировать объект
  const activeObjFunc = () => {
    if (Object.prop_obj.active) {
      Object.activeObj(false);
    } else {
      Object.activeObj(true);
    }
    HistoryStore.addHistory();
  };

  // Ручное изменение координат
  const rewriteManualX = (e) => {
    if (e.target.value > 0) {
      setValueX(e.target.value);
      Object.manualX(e.target.value * Memory.mm);
      HistoryStore.addHistory();
    }
  };

  const rewriteManualY = (e) => {
    if (e.target.value > 0) {
      setValueY(e.target.value);
      Object.manualY(e.target.value * Memory.mm);
      HistoryStore.addHistory();
    }
  };

  const rewriteManualW = (e) => {
    if (e.target.value > 5.1) {
      setValueW(e.target.value);
      Object.manualW(e.target.value);
      HistoryStore.addHistory();
    }
  };

  const rewriteManualH = (e) => {
    if (e.target.value > 5.1) {
      setValueH(e.target.value);
      Object.manualH(e.target.value);
      HistoryStore.addHistory();
    }
  };

  return (
    <ul className="list_props">
      {!nameFlag ? (
        <li onClick={saveNewName} className="prop_obj">
          <span className="prop_obj_info">Имя: </span>
          {Object.prop_obj.name}
        </li>
      ) : (
        <li className="prop_obj">
          {" "}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="введите имя"
            className="prop_obj_new_name"
            type="text"
          />{" "}
          <span className="btn_ok_new_name" onClick={saveNewName}>
            ок
          </span>
        </li>
      )}

      <li className="prop_obj">
        <span className="prop_obj_info">Ширина:</span>{" "}
        {Object.prop_obj.w !== "fit-content" ? (
          <>
            {" "}
            <input
              className="input_coord_prop_obj"
              type="number"
              value={Math.round(Object.prop_obj.w * 100) / 100}
              onChange={rewriteManualW}
            />{" "}
            мм
          </>
        ) : (
          "Нет"
        )}
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">Высота:</span>{" "}
        {Object.prop_obj.w !== "fit-content" ? (
          <>
            {" "}
            <input
              className="input_coord_prop_obj"
              type="number"
              value={Math.round(Object.prop_obj.h * 100) / 100}
              onChange={rewriteManualH}
            />{" "}
            мм
          </>
        ) : (
          "Нет"
        )}
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">X:</span>{" "}
        <input
          className="input_coord_prop_obj"
          type="number"
          value={Math.round(Object.prop_obj.x * 100) / 100}
          onChange={rewriteManualX}
        />
        мм
      </li>
      <li className="prop_obj">
        <span className="prop_obj_info">Y:</span>{" "}
        <input
          className="input_coord_prop_obj"
          type="number"
          value={Math.round(Object.prop_obj.y * 100) / 100}
          onChange={rewriteManualY}
        />{" "}
        мм
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
              {Object.prop_obj.style.position === "left" ? "слева" : <></>}
              {Object.prop_obj.style.position === "center" ? (
                "в центре"
              ) : (
                <></>
              )}{" "}
              {Object.prop_obj.style.position === "right" ? "справа" : <></>}
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
              onClick={() => setFlagFonts(true)}
              className="prop_obj_font_family"
            >
              {Object.prop_obj.style.fontFamily}
            </span>
          </li>
        </>
      ) : (
        <></>
      )}

      <li>
        {Object.prop_obj.typeObj === "block" ? (
          <textarea
            onBlur={() => HistoryStore.addHistory()}
            className="prop_obj-inp"
            type="text"
            value={Object.prop_obj.body}
            onChange={editBodyFunc}
            placeholder="Введите текст"
          ></textarea>
        ) : (
          <input
            ref={inputPropRef}
            onBlur={() => HistoryStore.addHistory()}
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
          <span onClick={resetBody}>Сбросить текст</span>
          {Memory.buffer_text_flag &&
          Memory.buffer_obj.id === Object.prop_obj.id ? (
            <span onClick={restoryBody}>Восстановить</span>
          ) : (
            ""
          )}
        </li>
      ) : (
        <></>
      )}
      <li className="prop_obj">
        <span className="prop_obj_info">Активен</span>
        {Object.prop_obj.active ? (
          <span onClick={activeObjFunc} className="my_chexbox-active"></span>
        ) : (
          <span onClick={activeObjFunc} className="my_chexbox"></span>
        )}
      </li>
      <li className="prop_obj-delete" onClick={deleteObj}>
        Удалить ( Del )
      </li>
    </ul>
  );
});
