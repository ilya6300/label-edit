import { makeAutoObservable } from "mobx";
import Memory from "./Memory";

class Object {
  constructor() {
    makeAutoObservable(this);
  }

  objects = [
  ];
  //   Объект с которым взаимодействуем
  obj = {};
  prop_obj = {};
  //   Начальные координаты объекта, с которым взаимодействуем
  yObj = null;
  xObj = null;
  wObj = null;
  hObj = null;

  //   Вычисление X при перимещение
  getCoordX = (x, canvasX) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxX = x - canvasX - this.xObj;
        el.x = el.pxX / Memory.mm;
      }
    });
  };
  //   Вычисление Y при перимещение
  getCoordY = (y, canvasY) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxY = y - canvasY - this.yObj;
        el.y = el.pxY / Memory.mm;
      }
    });
  };
  //   Изменение W при масштабирование
  getAttrW = (x, canvasX) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxW = (x - canvasX - this.obj.target.offsetLeft) / Memory.mm;
        el.w = el.pxW;
      }
    });
  };
  //   Изменение H при масштабирование
  getAttrH = (y, canvasY) => {
    this.objects.forEach((el) => {
      if (el.id === Number(this.obj.target.id)) {
        el.pxH = (y - canvasY - this.obj.target.offsetTop) / Memory.mm;
        el.h = el.pxH;
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
        console.log(body);
        if (body !== undefined) {
          el.body = body;
        }
      }
    });
  };
  //   Добавить объект в массив
  addObj = (obj) => {
    this.objects = [...this.objects, obj];
  };
}

export default new Object();
