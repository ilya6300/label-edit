import { makeAutoObservable } from "mobx";
import Object from "./Object";

class Memory {
  mm = 3.579575175750246;
  // Флаг отображение файлов на этикетке
  visible_objects = true;
  // move
  //  Переменные этикетки
  width_label = 58;
  height_label = 40;
  radius_label = 5;
  gap = 2;
  // Флаг отображения свойств объектов
  properties = false;
  // Буфер текста после сброса текста в свойствах
  buffer_obj = null;
  buffer_text = "";
  buffer_text_flag = false;

  constructor() {
    makeAutoObservable(this);
  }

  widthLabelChange = (value) => {
    this.width_label = value;
  };
  heigthLabelChange = (value) => {
    this.height_label = value;
  };
  radiusLabelChange = (value) => {
    this.radius_label = value;
  };
  gapLabelChange = (value) => {
    this.gap = value;
  };
  // Изменение флага свойств
  updateFlagPropsObj = (boolean) => {
    this.properties = boolean;
  };
  // Положить объект в буфер
  setBufferPropObj = () => {
    this.buffer_obj = Object.prop_obj;
  };
  // Сохранить текст в буффере
  setTextBuffer = () => {
    this.buffer_text = Object.prop_obj.body;
  };
  // Флаг отображение кнопки восстановления из буффера
  updateFlagPropsBuffer = (boolean) => {
    this.buffer_text_flag = boolean;
  };
  updateFlagVisibleObj = (boolean) => {
    this.visible_objects = boolean;
  }
}

export default new Memory();
