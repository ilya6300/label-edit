import React, { useRef, useState } from "react";
import service from "../../request/service";

export const StartAddFonts = () => {
  const refInpFile = useRef(null);
  const [nameFont, setNameFont] = useState("");
  const [fileFont, setFileFont] = useState(null);
  const [newFont, setNewFont] = useState(false);

  const [begin, setBegin] = useState(false);

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
    console.log(e.target.files[0])
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

  const saveDefaultFont = () => {
    saveFont(fileFont)

  };

  if (!begin) {
    return (
      <div className="startfonts_container">
        <p className="startfonts_container-text">
          В базе данных нет загруженных шрифтов и нет выбранных по умолчанию.
          Загрузите первый шрифт, чтобы начать работу с редактором.
        </p>
        <div>
          {newFont ? (
            <>
              <li className="add_img_name_container-text">
                Загружен шрифт {nameFont}. Оставьте текущее название или введите
                своё
              </li>
              <input
                value={nameFont}
                onChange={(e) =>
                  setNameFont(e.target.value.replace(/(\.)/g, ""))
                }
                className="add_img_name_container-inp"
                type="text"
                placeholder="Введите название шрифта"
              />
              <li className="startfonts_container_btn">
                {" "}
                <span
                  className="startfonts_container_name_btn"
                  onClick={saveDefaultFont}
                >
                  Сохранить
                </span>
                <span
                  onClick={closedContainer}
                  className="startfonts_container_name_btn"
                >
                  Отмена
                </span>
              </li>
            </>
          ) : (
            <li className="startfonts_container-add_btn">
              <span className="startfonts_container_add_btn-text">
                Добавьте свой первый шрифт
              </span>
              <span className="startfonts_container_add_btn" onClick={addFont}>
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
        </div>
      </div>
    );
  } else {
    <div className="begin_container">
        <button className="begin_btn"></button>
    </div>
  }
};
