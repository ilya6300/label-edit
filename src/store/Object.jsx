import { makeAutoObservable } from "mobx";
import Memory from "./Memory";

class Object {
  constructor() {
    makeAutoObservable(this);
  }

  objects = [];
  //   Объект с которым взаимодействуем
  obj = {};
  prop_obj = {};
  //   Начальные координаты объекта, с которым взаимодействуем
  yObj = null;
  xObj = null;
  wObj = null;
  hObj = null;
  //   img
  //   img = null

  //   Вычисление X при перимещение
  getCoordX = (x, canvasX) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxX = x - canvasX - this.obj.nativeEvent.layerX;
        el.x = el.pxX / Memory.mm;
      }
    });
  };
  //   Вычисление Y при перимещение
  getCoordY = (y, canvasY) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxY = y - canvasY - this.obj.nativeEvent.layerY;
        el.y = el.pxY / Memory.mm;
      }
    });
  };
  //   Изменение W при масштабирование
  getAttrW = (x, canvasX) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxW = (x - this.obj.target.getBoundingClientRect().x) / Memory.mm;
        el.w = el.pxW;
      }
    });
  };
  //   Изменение H при масштабирование
  getAttrH = (y, canvasY) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxH = (y - this.obj.target.getBoundingClientRect().y) / Memory.mm;
        el.h = el.pxH;
        if (el.typeBarcode === "datamatrix" || el.typeBarcode === "qrcode") {
          console.log("datamatrix");
          el.h = el.w;
          el.pxH = el.pxW;
        }
      }
    });
  };
  //   Изменение переменной масштабирования
  getFlagEditSize = (boolean) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.editSize = boolean;
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
    console.log(this.prop_obj);
  };
  //   Очистка массива
  reset = () => {
    this.objects = [];
  };
  //   Удалить объект из массива
  deleteObject = (obj) => {
    console.log(obj);
    Memory.updateFlagVisibleObj(false);
    this.objects = this.objects.filter((o) => o.id !== obj.id);
    Memory.updateFlagVisibleObj(true);
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
    console.log(this.obj.target.id);
    this.objects.forEach((el) => {
      let reg = this.obj.target.id.replace(/\D/gm, "");
      if (el.id === Number(reg)) {
        const this_obj = { ...el };
        console.log(typeof el.style.rotate);
        if (
          (deg === "90" || deg === "270") &&
          el.style.rotate !== "90" &&
          el.style.rotate !== "180"
        ) {
          console.log("rotate");
          el.w = this_obj.h;
          el.h = this_obj.w;
        }
        el.style.rotate = deg;
      }
    });
  };
}

export default new Object();
