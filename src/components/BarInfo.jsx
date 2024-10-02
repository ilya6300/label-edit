import React from "react";

export const BarInfo = () => {
  return (
    <label className="barlabel_info_container">
      <span className="barlabel_info_btn">?</span>
      <ul className="barlabel_info">
        <li>"Del" - удалить выбранный элемент</li>
        <li>"Shift" - для сохранения пропорций при редактирование</li>
        <li>"Ctrl" + "z" - Отменить последнее действие</li>
        <li>"Ctrl" + "y" - Вернуть отменённое действие</li>
        <li>
          "<span className="arrow_bar_info-left"></span>,{" "}
          <span className="arrow_bar_info-right"></span>,{" "}
          <span className="arrow_bar_info-up"></span>,{" "}
          <span className="arrow_bar_info-down"></span>" - смещение по "x" и "y"
          координатам выбранного элемента
        </li>
      </ul>
    </label>
  );
};
