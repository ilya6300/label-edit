import React, { useEffect, useRef, useState } from "react";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import Memory from "../store/Memory";
import HistoryStore from "../store/HistoryStore";
import { ListImg } from "./img_components/ListImg";
import service from "../request/service";

export const PropertiesObj = observer(
  ({ setFlagFonts, inputPropRef, setVarText }) => {
    // Переменные свойств
    const [valueX, setValueX] = useState(Object.prop_obj.x);
    const [valueY, setValueY] = useState(Object.prop_obj.y);
    const [valueW, setValueW] = useState(Object.prop_obj.w);
    const [valueH, setValueH] = useState(Object.prop_obj.h);
    const [value, setValue] = useState(Object.prop_obj.body);
    const [fontSize, setFontSize] = useState(
      Object.prop_obj !== null ? Object.prop_obj.style.fontSize : 8
    );
    const [newName, setNewName] = useState(Object.prop_obj.name);
    // Флаги отображения свойств
    const [blockTextPosition, setBlockTextPosition] = useState(false);
    const [rotate, setRotate] = useState(false);
    const [nameFlag, setNameFlag] = useState(false);
    const [changeImgFlag, setChangeImgFlag] = useState(false);

    const blockTextPositionRef = useRef(null);
    const rotateRef = useRef(null);

    useEffect(() => {
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
      if (Object.prop_obj.typeObj === "text") {
        Object.manualW(Object.obj.target.offsetWidth / Memory.mm);
      }
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
      Memory.updateFlagPropsObj(false);
      Object.deleteObject(Object.prop_obj);
    };

    // Изменение размера шрифта у объекта
    const updateFontSizeFunc = (e) => {
      if (e.target.value >= 0) {
        setFontSize(e.target.value);
        Object.updateFontSize(e.target.value);
      }
    };

    // Изменение размера шрифта у объекта
    const updateLineSizeFunc = (e) => {
      if (e.target.value >= 0) {
        setFontSize(Math.round(e.target.value * 100) / 100);
        Object.updateLine(Math.round(e.target.value * 100) / 100);
      }
    };

    // Изменение позиции блока
    const blockAlign = (e) => {
      Object.textAlign(e.target.id);
    };

    // Изменение поворота
    const rotateFunc = (e) => {
      Object.updateRotate(e.target.id);
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
    };

    // Ручное изменение координат
    const rewriteManualX = (e) => {
      if (e.target.value >= 0) {
        setValueX(e.target.value);
        Object.manualX(e.target.value * Memory.mm);
      } else {
        if (e.target.value < 0) {
          setValueX(0);
          Object.manualX(0);
        }
      }
    };

    const rewriteManualY = (e) => {
      if (e.target.value >= 0) {
        setValueY(e.target.value);
        Object.manualY(e.target.value * Memory.mm);
      } else {
        if (e.target.value < 0) {
          setValueY(0);
          Object.manualY(0);
        }
      }
    };

    const rewriteManualW = (e) => {
      if (
        (Object.prop_obj.typeBarcode !== "ean13" ||
          Object.prop_obj.typeBarcode !== "code128") &&
        Object.prop_obj.typeObj !== "lines" &&
        Object.prop_obj.typeBarcode !== "datamatrix"
      ) {
        setValueW(e.target.value);
        Object.manualW(e.target.value);
      } else if (
        Object.prop_obj.typeBarcode === "ean13" ||
        Object.prop_obj.typeBarcode === "code128"
      ) {
        if (Number(e.target.value) < 1) return;
        if (Number(e.target.value) > 4) return;
        if (Number(e.target.value) >= 1 || Number(e.target.value) <= 4) {
          setValueW(e.target.value);
          Object.manualW(e.target.value);
        }
        setTimeout(() => {
          Object.prop_obj.pxW =
            Object.obj.nativeEvent.target.clientWidth / Memory.mm;
        }, 650);
      } else if (Object.prop_obj.typeObj === "lines") {
        setValueW(e.target.value);
        Object.manualW(e.target.value);
      } else if (Object.prop_obj.typeBarcode === "datamatrix") {
        if (e.target.value.match(/[\d,]/gm) && e.target.value >= 1) {
          Object.manualW(e.target.value);
        }
        // }
      }
    };

    const rewriteManualH = (e) => {
      if (
        Object.prop_obj.typeObj !== "lines" &&
        Object.prop_obj.typeBarcode !== "datamatrix"
      ) {
        setValueH(e.target.value);
        Object.manualH(e.target.value);
      } else if (
        Object.prop_obj.typeObj === "lines"
      ) {
        setValueH(e.target.value);
        Object.manualH(e.target.value);
      } else if (Object.prop_obj.typeBarcode === "datamatrix") {
        if (e.target.value.match(/[\d,]/gm) && e.target.value >= 1) {
          Object.manualW(e.target.value);
        }
      }
      // }
    };

    const visibleTextBarcodeFunc = () => {
      if (!Object.prop_obj.human_readable_visible) {
        Object.humanReadableFlag(true);
        Object.humanReadable(2);
        setLeftBodyCls("human_readable_visible_position_t");
        setCenterBodyCls("human_readable_visible_position_t_active");
        setRightBodyCls("human_readable_visible_position_t");
      } else {
        Object.humanReadableFlag(false);
        Object.humanReadable(0);
      }
    };

    // Позиционирование body/текста у barcoda
    const [leftBodyCls, setLeftBodyCls] = useState(
      Object.prop_obj.human_readable === 1
        ? "human_readable_visible_position_t_active"
        : "human_readable_visible_position_t"
    );

    const [centerBodyCls, setCenterBodyCls] = useState(
      Object.prop_obj.human_readable === 2
        ? "human_readable_visible_position_t_active"
        : "human_readable_visible_position_t"
    );

    const [rightBodyCls, setRightBodyCls] = useState(
      Object.prop_obj.human_readable === 3
        ? "human_readable_visible_position_t_active"
        : "human_readable_visible_position_t"
    );

    const leftBodyFunc = () => {
      setLeftBodyCls("human_readable_visible_position_t_active");
      setCenterBodyCls("human_readable_visible_position_t");
      setRightBodyCls("human_readable_visible_position_t");
      Object.humanReadable(1);
    };
    const centerBodyFunc = () => {
      setLeftBodyCls("human_readable_visible_position_t");
      setCenterBodyCls("human_readable_visible_position_t_active");
      setRightBodyCls("human_readable_visible_position_t");
      Object.humanReadable(2);
    };
    const rightBodyFunc = () => {
      setLeftBodyCls("human_readable_visible_position_t");
      setCenterBodyCls("human_readable_visible_position_t");
      setRightBodyCls("human_readable_visible_position_t_active");
      Object.humanReadable(3);
    };

    const [radiusBox, setRadiusBox] = useState("");
    const radiusBoxFunc = (e) => {
      if (e.target.value >= 0) {
        setRadiusBox(e.target.value);
        Object.boxRadius(e.target.value);
      }
    };

    const changeNewImg = () => {
      if (changeImgFlag) {
        setChangeImgFlag(false);
      } else {
        service.getImages();
        setChangeImgFlag(true);
      }
    };

    const getThisImg = (e) => {
      console.log(e);
      Object.editBody(e.data);
      Object.upDateImgID(e.id);
    };

    const openFontsList = () => {
      setFlagFonts(true);
      Object.getFlagEditSize(true);
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
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="введите имя"
              className="prop_obj_new_name"
              type="text"
            />
            <span className="btn_ok_new_name" onClick={saveNewName}>
              ок
            </span>
          </li>
        )}
        {Object.prop_obj.typeBarcode === "ean13" ||
        Object.prop_obj.typeBarcode === "code128" ? (
          <li className="prop_obj">{Object.prop_obj.typeBarcode}</li>
        ) : (
          <></>
        )}
        <li className="prop_obj">
          <span className="prop_obj_info">Ширина:</span>{" "}
          {Object.prop_obj.w !== "fit-content" ? (
            <>
              {" "}
              <input
                className="input_coord_prop_obj"
                type="number"
                value={
                  Object.prop_obj.w !== ""
                    ? Math.round(Object.prop_obj.w * 100) / 100
                    : ""
                }
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
              <input
                className="input_coord_prop_obj"
                type="number"
                value={
                  Object.prop_obj.h !== ""
                    ? Math.round(Object.prop_obj.h * 100) / 100
                    : ""
                }
                onChange={rewriteManualH}
              />{" "}
              мм
            </>
          ) : (
            "Нет"
          )}
        </li>
        <li className="prop_obj">
          <span className="prop_obj_info">X:</span>
          <input
            className="input_coord_prop_obj"
            type="number"
            value={
              Object.prop_obj.x >= 0
                ? Math.round(Object.prop_obj.x * 100) / 100
                : ""
            }
            onChange={rewriteManualX}
          />
          мм
        </li>
        <li className="prop_obj">
          <span className="prop_obj_info">Y:</span>{" "}
          <input
            className="input_coord_prop_obj"
            type="number"
            value={
              Object.prop_obj.y >= 0
                ? Math.round(Object.prop_obj.y * 100) / 100
                : ""
            }
            onChange={rewriteManualY}
          />
          мм
        </li>
        {Object.prop_obj.typeObj !== "box" &&
        Object.prop_obj.typeObj !== "img" ? (
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
            <span className="prop_obj_info">Поворот:</span>
            <span
              className="prop_obj_info_modal"
              onClick={() => setRotate(true)}
            >
              {Math.round(Object.prop_obj.style.rotate)} %
            </span>
          </li>
        ) : (
          <></>
        )}

        {Object.prop_obj.typeObj === "block" ? (
          <li ref={blockTextPositionRef} className="prop_obj">
            <span className="prop_obj_info">Позиция:</span>{" "}
            <label
              onClick={() => setBlockTextPosition(true)}
              className="prop_obj_position_label"
            >
              <span className="prop_obj_info_modal">
                {String(Object.prop_obj.style.position) === "2"
                  ? "в центре"
                  : String(Object.prop_obj.style.position) === "3"
                  ? "справа"
                  : "слева"}
              </span>
              {blockTextPosition ? (
                <span className="prop_obj_position">
                  <span
                    className="prop_obj_position_span"
                    id="1"
                    onClick={blockAlign}
                  >
                    Лево
                  </span>
                  <span
                    className="prop_obj_position_span"
                    id="2"
                    onClick={blockAlign}
                  >
                    Центр
                  </span>
                  <span
                    className="prop_obj_position_span"
                    id="3"
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
                value={fontSize}
                onChange={updateFontSizeFunc}
              />
            </li>
            {Object.prop_obj.typeObj !== "box" ? (
              <li className="prop_obj">
                Шрифт:{" "}
                <span onClick={openFontsList} className="prop_obj_font_family">
                  {Object.prop_obj.style.fontFamily}
                </span>
              </li>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        {Object.prop_obj.typeObj === "box" ? (
          <>
            <li className="prop_obj">
              <span className="prop_obj_info">Размер :</span>
              <input
                className="prop_obj_font_size"
                type="number"
                value={Object.prop_obj.line_thickness}
                onChange={updateLineSizeFunc}
              />
            </li>
            <li className="prop_obj">
              <span className="prop_obj_info">Скругление:</span>
              <input
                className="prop_obj_font_size"
                type="number"
                value={Object.prop_obj.borderRadius}
                onChange={radiusBoxFunc}
              />
            </li>
          </>
        ) : (
          <></>
        )}
        {Object.prop_obj.typeObj !== "lines" &&
        Object.prop_obj.typeObj !== "box" &&
        Object.prop_obj.typeObj !== "img" ? (
          <label className="flx_align">
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
            <li>
              <span
                className="prop_obj_var_text"
                onClick={() => setVarText(true)}
              ></span>
            </li>
          </label>
        ) : (
          <></>
        )}

        {Object.prop_obj.typeBarcode === "code128" ||
        Object.prop_obj.typeBarcode === "ean13" ? (
          <li className="prop_obj">
            <span className="prop_obj_info prop_obj_info-human_readable_visible">
              Текст виден
            </span>
            {Object.prop_obj.human_readable_visible ? (
              <label className="human_readable_visible_container">
                <span onClick={leftBodyFunc} className={leftBodyCls}>
                  T
                </span>
                <span onClick={centerBodyFunc} className={centerBodyCls}>
                  T
                </span>
                <span onClick={rightBodyFunc} className={rightBodyCls}>
                  T
                </span>
              </label>
            ) : (
              <></>
            )}

            {Object.prop_obj.human_readable_visible ? (
              <span
                onClick={visibleTextBarcodeFunc}
                className="my_chexbox-active"
                style={{ right: 0 }}
              ></span>
            ) : (
              <span
                onClick={visibleTextBarcodeFunc}
                className="my_chexbox"
                style={{ right: 0 }}
              ></span>
            )}
          </li>
        ) : (
          <></>
        )}
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
        {Object.prop_obj.typeObj === "img" ? (
          <>
            <li className="prop_obj">
              <span className="prop_obj_info">Изменить изображение</span>

              <span
                onClick={changeNewImg}
                className="my_chexbox-new_img"
              ></span>
            </li>
            {changeImgFlag ? (
              <li className="prop_obj props_img_container">
                <ListImg getThisImg={getThisImg} />
              </li>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        {}
        <li className="prop_obj-delete" onClick={deleteObj}>
          Удалить ( Del )
        </li>
      </ul>
    );
  }
);
