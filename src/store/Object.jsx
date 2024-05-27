import { makeAutoObservable, toJS } from "mobx";
import Memory from "./Memory";
import Templates from "./Templates";
import keyboard from "./keyboard";

class Object {
  constructor() {
    makeAutoObservable(this);
  }

  objects = [];
  objects_preview = [];

  //   Объект с которым взаимодействуем
  obj = null;
  prop_obj = {};
  //   Начальные координаты объекта, с которым взаимодействуем
  yObj = null;
  xObj = null;
  wObj = null;
  hObj = null;
  //   img
  //   img = null
  // выбрать шаблон
  select = () => {
    this.reset();
    this.objects = [...this.objects_preview];
  };
  getObject = (e) => {
    this.obj = e;
  };
  getCoordClone = (x, canvasX, y, canvasY, lblRef) => {
    this.objects.forEach((el) => {
      if (el.id === 9999) {
        if (el.editSize !== true) {
          // x
          if (
            x - canvasX - this.obj.nativeEvent.layerX > 0 &&
            lblRef.current.getBoundingClientRect().width - 3 >
              x - canvasX - this.obj.nativeEvent.layerX + this.obj.nativeEvent.target.clientWidth
          ) {
            el.pxX = x - canvasX - this.obj.nativeEvent.layerX;
            el.x = el.pxX / Memory.mm;
          }
          // y
          if (
            y - canvasY - this.obj.nativeEvent.layerY > 0 &&
            lblRef.current.getBoundingClientRect().height - 3 >
              y - canvasY - this.obj.nativeEvent.layerY + this.obj.nativeEvent.target.clientHeight
          ) {
            el.pxY = y - canvasY - this.obj.nativeEvent.layerY;
            el.y = el.pxY / Memory.mm;
          }
        }
      }
    });
  };
  //   Вычисление X и Y при перимещение
  getCoordXY = (collision) => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        const clone = this.objects.find((f) => f.id === 9999);
        if (clone) {
          if (!collision) {
            el.pxX = clone.pxX;
            el.pxY = clone.pxY;
          } else {
            el.pxX = (Memory.mm * clone.pxX - 1) / Memory.mm;
            el.pxY = (Memory.mm * clone.pxY - 1) / Memory.mm;
          }
          el.x = clone.x;
          el.y = clone.y;
        }
      }
    });
  };
  // Ручная смена X координат
  manualX = (coord) => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        el.pxX = coord;
        el.x = coord / Memory.mm;
      }
    });
  };
  // Ручная смена Y координат
  manualY = (coord) => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        el.pxY = coord;
        el.y = coord / Memory.mm;
      }
    });
  };
  //Ручная смена ширины
  manualW = (coord) => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        el.pxW = coord;
        el.w = coord;
        if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
          el.pxH = coord;
          el.h = coord;
        }
      }
    });
  };
  //Ручная смена высоты
  manualH = (coord) => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        el.pxH = coord;
        el.h = coord;
        if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
          el.pxW = coord;
          el.w = coord;
        }
      }
    });
  };
  // Получение клоном ширины и высоты
  getAttributeClone = (x, y, lblRef) => {
    this.objects.forEach((el) => {
      if (el.id === 9999) {
        if (
          el.style.rotate === "90" ||
          el.style.rotate === "180" ||
          el.style.rotate === "270"
        ) {
          return;
        }
        if (el.editSizeW) {
          if ((x - this.obj.target.getBoundingClientRect().x) / Memory.mm < 3) {
            return;
          }
          el.pxW = (x - this.obj.target.getBoundingClientRect().x) / Memory.mm;

          if (
            lblRef.current.getBoundingClientRect().x +
              lblRef.current.getBoundingClientRect().width -
              x <
            5
          ) {
            el.pxW = (el.pxW * Memory.mm - 1) / Memory.mm;
          }
          el.w = el.pxW;
          if (
            (el.typeBarcode !== "datamatrix" || el.typeBarcode !== "qrcode") &&
            keyboard.shift_key
          ) {
            el.pxH = el.pxW * Memory.coefficient_w;
            el.h = el.w * Memory.coefficient_w;
          } else if (
            el.typeBarcode === "datamatrix" ||
            el.typeBarcode === "qrcode"
          ) {
            el.h = el.w;
            el.pxH = el.pxW;
          }
        }

        if (el.editSizeH) {
          if ((y - this.obj.target.getBoundingClientRect().y) / Memory.mm < 3) {
            return;
          } else
            el.pxH =
              (y - this.obj.target.getBoundingClientRect().y) / Memory.mm;

          if (
            lblRef.current.getBoundingClientRect().y +
              lblRef.current.getBoundingClientRect().height -
              y <
            5
          ) {
            el.pxH = (el.pxH * Memory.mm - 1) / Memory.mm;
          }
          el.h = el.pxH;
          if (
            (el.typeBarcode !== "datamatrix" || el.typeBarcode !== "qrcode") &&
            keyboard.shift_key
          ) {
            el.pxW = el.pxH * Memory.coefficient_h;
            el.w = el.h * Memory.coefficient_h;
          } else if (
            el.typeBarcode === "datamatrix" ||
            el.typeBarcode === "qrcode"
          ) {
            el.w = el.h;
            el.pxW = el.pxH;
          }
        }
      }
    });
  };
  //
  saveAttributeWH = () => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        const clone = this.objects.find((f) => f.id === 9999);
        if (clone) {
          el.pxW = clone.pxW;
          el.pxH = clone.pxH;
          el.w = clone.w;
          el.h = clone.h;
        }
      }
    });
  };
  //   Изменение переменной масштабирования
  getFlagEditSize = (boolean, booleanW, booleanH) => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.editSize = boolean;
        el.editSizeW = booleanW;
        el.editSizeH = booleanH;
      }
    });
  };
  //   Редактирвоание body
  editBody = (body) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        if (body !== undefined) {
          el.body = body;
        }
      }
    });
  };
  //   Изменить размер текста в боди
  updateFontSize = (size) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.prop_obj.id)) {
        if (size !== undefined) {
          console.log(el.id);
          el.style.fontSize = size;
        }
      }
    });
  };
  //   Добавить объект в массив
  addObj = (obj) => {
    this.objects = [...this.objects, obj];
  };
  // Добавить объект в массив превью
  addObjPreiew = (obj) => {
    this.objects_preview = [...this.objects_preview, obj];
  };
  // Сбросить массив превью
  resetPreiew = () => {
    this.objects_preview = [];
  };
  //   Записать объект в prop_obj
  setPropObj = (obj) => {
    this.prop_obj = obj;
  };
  //   Очистка массива
  reset = () => {
    this.obj = null;
    this.objects = [];
  };
  //   Новый шаблон
  newTemplate = () => {
    this.obj = null;
    this.objects = [];
    Templates.preview_templates = [];
    this.resetPreiew();
  };
  //   Удалить объект из массива
  deleteObject = () => {
    // console.log(this.prop_obj);
    Memory.updateFlagVisibleObj(false);
    this.objects = this.objects.filter((o) => o.id !== this.prop_obj.id);
    this.obj = null;
    Memory.updateFlagVisibleObj(true);
  };
  deleteClone = () => {
    this.objects = this.objects.filter((o) => o.id !== 9999);
  };
  //   Изменить стиль шрифта
  updateFontFamily = (family) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.style.fontFamily = family.name;
        el.font_family_id = family.id;
      }
    });
  };
  //   Изменение позиции
  textAlign = (position) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.style.position = position;
      }
    });
  };
  //   Изменение позиции
  updateRotate = (deg) => {
    this.objects.forEach((el) => {
      let reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        // const this_obj = { ...el };
        // if (
        //   (deg === "90" || deg === "270") &&
        //   el.style.rotate !== "90" &&
        //   el.style.rotate !== "180"
        // ) {
        //   el.w = this_obj.h;
        //   el.h = this_obj.w;
        // }
        // if (
        //   (deg === "0" || deg === "180") &&
        //   (el.style.rotate === "90" || el.style.rotate === "180")
        // ) {
        //   el.w = this_obj.h;
        //   el.h = this_obj.w;
        // }
        el.style.rotate = deg;
      }
    });
  };
  // Записать имя
  saveName = (name) => {
    let reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.name = name;
      }
    });
  };
  // Активировать или деактивировать объект
  activeObj = (boolean) => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.active = boolean;
      }
    });
  };
  // boxshadow
  boxShadowObj = () => {
    // console.log("boxShadowObj");
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        if (el.style.boxShadow === "0 0 1px 1px var(--error)") {
          let idInterval;
          idInterval = setInterval(() => {
            el.cls = [...el.cls, "border_activ"];
            setTimeout(() => {
              el.style.boxShadow = "0 0 1px 1px var(--error)";
            }, 500);
          }, 1000);
          setTimeout(() => {
            clearTimeout(idInterval);
          }, 3000);

          return;
        }
        if (el.typeObj !== "block") {
          if (!el.cls.includes("border_activ-3"))
          el.cls = [...el.cls, "border_activ-3"];
        } else {
          if (!el.cls.includes("border_activ-0"))
          el.cls = [...el.cls, "border_activ-0"];
        }
      } else {
        if (el.style.boxShadow === "0 0 1px 1px var(--error)") {
          return;
        }
        return (el.cls = el.cls.filter(
          (cl) => cl !== "border_activ-0" && cl !== "border_activ-3"
        ));
      }
    });
  };
  // Z index
  zIndexObj = () => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.zIndex = 5;
      } else {
        el.zIndex = 2;
      }
    });
  };
  // изменение стайла тени при наведение
  hoverElementShadow = (element, shadow) => {
    const reg = element.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.style.boxShadow = shadow;
      } else {
        el.style.boxShadow = "none";
      }
    });
  };
  // selectHistory = (h) => {
  //   console.log(toJS(h), toJS(h.objects));
  //   this.objects = h.objects;
  // };
}

export default new Object();
