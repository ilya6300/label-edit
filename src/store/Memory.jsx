import { makeAutoObservable } from "mobx";
import Object from "./Object";
import Templates from "./Templates";
import Msg from "./Msg";

class Memory {
  mm = 3.709575175750246;
  mm_qr = 3.999575175750246;
  dpi = 12;

  button_left_press = false;
  left_press_timer = false;
  move_flag = false;
  post_download_flag = false;

  visible_printer_settings = true;

  setPostDownLoadFlag = (boolean) => {
    this.post_download_flag = boolean;
  };

  setVisiblePrinterSettings = async () => {
    this.visible_printer_settings = true;
  };
  flagMoveCoord = (boolean) => {
    if (this.button_left_press) {
      this.move_flag = boolean;
    } else {
      this.move_flag = false;
    }
  };
  pressLeftDown = () => {
    this.left_press_timer = true;
    this.move_flag = false;
    setTimeout(() => {
      if (this.left_press_timer) {
        this.button_left_press = true;
      } else {
        this.button_left_press = false;
      }
    }, 50);
  };
  pressLeftUp = () => {
    setTimeout(() => {
      this.left_press_timer = false;
      this.button_left_press = false;
    }, 50);
  };
  // Флаг отображение файлов на этикетке
  visible_objects = true;
  visible_modal_post = false; // Флаг модального окна сохранения или изменения шаблона
  exchange = false; // флаг обмена с сервером
  exchangeFlag = (boolean) => {
    this.exchange = boolean;
  };
  visiblePost = (boolean) => {
    this.visible_modal_post = boolean;
  };
  //  Переменные этикетки
  width_label = 58;
  height_label = 40;
  radius_label = 5;
  gap = 2;
  DIRECTION_1 = 1;
  DIRECTION_2 = 0;
  ref_x = 0;
  ref_y = 0;
  name_template = "";
  // Временные переменные
  all_img = [];

  //  Масштаб этикетки редактора
  scale = 1;
  setScaleLabel = (value) => {
    this.scale = value;
    // Object.recalculationScaleCoord(value);
  };
  // Переменные окно предпросмотра
  scale_preview_index = 2;
  scales = [
    {
      scale: 0.5,
      padding: 10,
      text: "50%",
    },
    {
      scale: 0.75,
      padding: 10,
      text: "75%",
    },
    {
      scale: 1,
      padding: 10,
      text: "100%",
    },
    {
      scale: 1.25,
      padding: 9,
      text: "125%",
    },
    {
      scale: 1.5,
      padding: 8,
      text: "150%",
    },
    {
      scale: 1.75,
      padding: 7,
      text: "175%",
    },
    {
      scale: 2,
      padding: 6,
      text: "200%",
    },
    {
      scale: 2.25,
      padding: 5,
      text: "225%",
    },
    {
      scale: 2.5,
      padding: 4,
      text: "250%",
    },
    {
      scale: 2.75,
      padding: 3,
      text: "275%",
    },

    {
      scale: 3,
      padding: 2,
      text: "300%",
    },
  ];

  dpiChange = (value) => {
    this.dpi = value;
  };

  // При своение имени шаблона
  writeNameTemplate = () => {
    this.name_template = Templates.preview_templates.name;
  };

  // Флаг отображения свойств объектов
  properties = false;
  // Буфер текста после сброса текста в свойствах
  buffer_obj = null;
  buffer_text = "";
  buffer_text_flag = false;
  // коэффициэнт ширины
  coefficient_w = 1;
  // коэффициэнт высоты
  coefficient_h = 1;
  // Переменные текста
  var_date = [];

  // Шаблоны
  templates = [];

  constructor() {
    makeAutoObservable(this);
  }

  varDateWrite = (data) => {
    this.var_date = data;
  };
  // Сброс масштаба этикетки в 100%
  resetScale = () => {
    this.scale_preview_index = 2;
  };

  // Увеличить мастштаб предпросмотра
  incrementScale = () => {
    if (this.scale_preview_index + 1 !== this.scales.length) {
      this.scale_preview_index = this.scale_preview_index + 1;
    }
  };
  // Уменьшить мастштаб предпросмотра
  decrementScale = () => {
    if (this.scale_preview_index !== 0) {
      this.scale_preview_index = this.scale_preview_index - 1;
    }
  };
  // Обработка reference по оси x
  labelRefX = (value) => {
    this.ref_x = value;
  };
  // Обработка reference по оси y
  labelRefY = (value) => {
    this.ref_y = value;
  };
  // Обработка derection
  labelDirection1 = (value) => {
    this.DIRECTION_1 = value;
  };
  labelDirection2 = (value) => {
    this.DIRECTION_2 = value;
  };
  // Изменение ширины этикетки
  widthLabelChange = (value) => {
    this.width_label = value;
  };
  // Изменение высоты этикетки
  heigthLabelChange = (value) => {
    this.height_label = value;
  };
  // Изменение скругления углов этикетки
  radiusLabelChange = (value) => {
    this.radius_label = value;
  };
  // Изменение зазора между этикетками
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
  };

  calcCoefficientW = () => {
    this.coefficient_w = Object.prop_obj.h / Object.prop_obj.w;
  };
  calcCoefficientH = () => {
    this.coefficient_h = Object.prop_obj.w / Object.prop_obj.h;
  };

  regPost = (name) => {
    let name_slice = name.toUpperCase();
    if (name.length > 6) {
      name_slice = name.slice(0, 6);
    }
    let key = "";
    const abc = "QWERTYUIOPLKJHGFDSAZXCVBNM0123456789";
    let randomKey = abc[Math.floor(Math.random() * abc.length)];
    while (key.length < 2) {
      key += randomKey;
      randomKey = abc[Math.floor(Math.random() * abc.length)];
    }
    return name_slice + key;
  };
}

export default new Memory();
