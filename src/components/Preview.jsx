import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import Theme from "../store/Theme";

export const Preview = observer(
  ({
    valueImg,
    actionImg,
    name_btn,
    preview,
    name,
    setName,
    closedContainer,
  }) => {
    const writeName = (e) => {
      if (
        e.target.value.match(/[a-zA-Z\d_]/gm) ||
        e.target.value.length === 0
      ) {
        setName(
          e.target.value.replace(/[!@#№%^$:&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, "")
        );
      }
    };

    const refPreview = useRef(null);
    return (
      <div
        className="add_obj_img_preview_container"
        style={{ background: Theme.background }}
      >
        <p
          className="add_obj-title"
          style={{ borderBottom: Theme.theme_border }}
        >
          Предпросмотр
        </p>
        <div className="window_preview" ref={refPreview}>
          <img
            className="window_preview_img"
            src={preview ? valueImg : "data:image/bmp;base64," + valueImg}
            alt=""
          />
        </div>
        {preview ? (
          <ul className="add_img_name_container">
            <li className="add_img_name_container-text">
              Введите название на латинице. Максимум 8 символов:
            </li>
            <input
              value={name}
              onChange={writeName}
              className="prop_obj-inp"
              type="text"
              placeholder="Введите название (ENG)"
            />
          </ul>
        ) : (
          <li className="add_img_prev_select_text">{name}</li>
        )}
        <div className="preview_container_btn">
          <span className="btn_prev" onClick={actionImg}>
            {name_btn}
          </span>
          <span onClick={closedContainer} className="btn_prev">
            Закрыть
          </span>
        </div>
      </div>
    );
  }
);
