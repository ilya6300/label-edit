import React, { useRef, useState } from "react";

export const Preview = ({
  valueImg,
  actionImg,
  name_btn,
  preview,
  name,
  setName,
  closedContainer,
}) => {
  const refPreview = useRef(null);



  return (
    <div className="add_obj_img_preview_container">
      <p className="add_obj-title">Предпросмотр</p>
      <div className="window_preview" ref={refPreview}>
        <img
          className="window_preview_img"
          src={valueImg}
          alt=""
        />
      </div>
      {preview ? (
        <ul className="add_img_name_container">
          <li className="add_img_name_container-text">Введите название:</li>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="add_img_name_container-inp"
            type="text"
            placeholder="Введите название"
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
};
