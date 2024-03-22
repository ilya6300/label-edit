import { makeAutoObservable, toJS } from "mobx";
import Memory from "./Memory";

class Object {
  constructor() {
    makeAutoObservable(this);
  }

  objects = [];
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

  getObject = (e) => {
    this.obj = e;
  };
  getCoordClone = (x, canvasX, y, canvasY) => {
    this.objects.forEach((el) => {
      if (el.id === 9999) {
        if (el.editSize !== true) {
          el.pxX = x - canvasX - this.obj.nativeEvent.layerX;
          el.x = el.pxX / Memory.mm;
          el.pxY = y - canvasY - this.obj.nativeEvent.layerY;
          el.y = el.pxY / Memory.mm;
        }
      }
    });
  };
  //   Вычисление X при перимещение
  getCoordXY = () => {
    this.objects.forEach((el) => {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        const clone = this.objects.find((f) => f.id === 9999);
        if (clone) {
          el.pxX = clone.pxX;
          el.pxY = clone.pxY;
          el.x = clone.x;
          el.y = clone.y;
        }
      }
    });
  };
  //   Вычисление Y при перимещение
  // getCoordY = (y, canvasY) => {
  //   this.objects.forEach((el) => {
  //     if (el.id === Number(this.obj.target.id)) {
  //       el.pxY = y - canvasY - this.obj.nativeEvent.layerY;
  //       el.y = el.pxY / Memory.mm;
  //     }
  //   });
  // };
  // Получение клоном ширины и высоты
  getAttributeClone = (x, y) => {
    this.objects.forEach((el) => {
      if (el.id === 9999) {
        if (el.editSizeW) {
          el.pxW = (x - this.obj.target.getBoundingClientRect().x) / Memory.mm;
          el.w = el.pxW;
          if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
            el.h = el.w;
            el.pxH = el.pxW;
          }
        }
        if (el.editSizeH) {
          el.pxH = (y - this.obj.target.getBoundingClientRect().y) / Memory.mm;
          el.h = el.pxH;
          if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
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
  //   Изменение W при масштабирование
  getAttrW = (x, canvasX) => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.pxW = (x - this.obj.target.getBoundingClientRect().x) / Memory.mm;
        el.w = el.pxW;
      }
    });
  };
  //   Изменение H при масштабирование
  getAttrH = (y, canvasY) => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    this.objects.forEach((el) => {
      if (el.id === Number(reg)) {
        el.pxH = (y - this.obj.target.getBoundingClientRect().y) / Memory.mm;
        el.h = el.pxH;
        if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
          el.h = el.w;
          el.pxH = el.pxW;
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
      if (el.id === Number(this.obj.target.id)) {
        if (size !== undefined) {
          el.style.fontSize = size;
        }
      }
    });
  };
  //   Добавить объект в массив
  addObj = (obj) => {
    this.objects = [...this.objects, obj];
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
  //   Удалить объект из массива
  deleteObject = (obj) => {
    Memory.updateFlagVisibleObj(false);
    this.objects = this.objects.filter((o) => o.id !== obj.id);
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
        el.style.fontFamily = family;
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
        const this_obj = { ...el };
        if (
          (deg === "90" || deg === "270") &&
          el.style.rotate !== "90" &&
          el.style.rotate !== "180"
        ) {
          el.w = this_obj.h;
          el.h = this_obj.w;
        }
        if (
          (deg === "0" || deg === "180") &&
          (el.style.rotate === "90" || el.style.rotate === "180")
        ) {
          el.w = this_obj.h;
          el.h = this_obj.w;
        }
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
          el.cls = [...el.cls, "border_activ-3"];
        } else {
          el.cls = [...el.cls, "border_activ-0"];
        }
      } else {
        if (el.style.boxShadow === "0 0 1px 1px var(--error)") {
          return;
        }
        return (el.cls = el.cls.filter((cl) => cl !== "border_activ-0" && cl !== "border_activ-3"));
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
}

export default new Object();
