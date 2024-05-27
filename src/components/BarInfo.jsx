import React from 'react'

export const BarInfo = () => {
  return (
    <label className="barlabel_info_container">
    <span className="barlabel_info_btn">?</span>
    <ul className="barlabel_info">
      <li>"Del" - удалить выбранный элемент</li>
      <li>"Shift" - для сохранения пропорций при редактирование</li>
      <li>"Ctrl" + "z" - Отменить последнее действие</li>
      <li>"Ctrl" + "y" - Вернуть отменённое действие</li>
    </ul>
  </label>
  )
}
