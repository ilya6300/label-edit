import React, { useState, useRef, useEffect } from "react";
import { ListFontFamily } from "./ListFontFamily";
import service from "../../request/service";
import { observer } from "mobx-react-lite";
import { Loader } from "../Loader";

export const FontsContainer = observer(({ setFlagFonts }) => {
  const [nameFont, setNameFont] = useState("");
  const [newFont, setNewFont] = useState(false);
  const [fileFont, setFileFont] = useState(null);
  const refInpFile = useRef(null);

  useEffect(() => {
    service.getFonts();
  }, []);

  const addFont = () => {
    refInpFile.current.click();
  };

  const selectedFont = (e) => {
    const file = e.target.files[0].name;
    if (!file.toLowerCase().match(/\.ttf$/g)) {
      alert(
        "Загрузка не разрешена. Необходимо загрузить файл с разрешением ttf"
      );
      return;
    }
    setNameFont(e.target.files[0].name.replace(/(\.)|(...$)/g, ""));
    setFileFont(e.target.files[0]);
    setNewFont(true);
  };

  const closedContainer = () => {
    setNameFont("");
    setNewFont(false);
  };

  const saveFont = async (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      service.postFont(nameFont, reader.result);
      console.log(reader.result);
    };
    reader.readAsDataURL(file);
    setNameFont("");
    setNewFont(false);
  };


  return (
    <ul className="editor_list_obj_container_prop">
      <li className="add_obj-title">
        {" "}
        Шрифты{" "}
        <span
          className="container_closed_btn"
          onClick={() => setFlagFonts(false)}
        ></span>
      </li>

      {newFont ? (
        <>
          <li className="add_img_name_container-text">
            Загружен шрифт {nameFont}. Оставьте текущее название или введите
            своё
          </li>
          <input
            value={nameFont}
            onChange={(e) => setNameFont(e.target.value.replace(/(\.)/g, ""))}
            className="add_img_name_container-inp"
            type="text"
            placeholder="Введите название шрифта"
          />
          <li className="preview_container_btn">
            {" "}
            <span className="btn_add_font" onClick={() => saveFont(fileFont)}>
              Сохранить
            </span>
            <span onClick={closedContainer} className="btn_add_font">
              Отмена
            </span>
          </li>
        </>
      ) : (
        <li className="list_font_family_new_font add_obj-title">
          <span className="">Добавить шрифт</span>
          <span className="container_add_btn" onClick={addFont}>
            {" "}
            <input
              ref={refInpFile}
              onChange={selectedFont}
              type="file"
              className="hidden"
            />
          </span>
        </li>
      )}
      {service.fontsLoading ? <Loader /> : <ListFontFamily selectFontFamily={() => setFlagFonts(false)}/>}
    </ul>
  );
});
