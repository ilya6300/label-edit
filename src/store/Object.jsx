import { makeAutoObservable, toJS } from "mobx";
import Memory from "./Memory";
import Templates from "./Templates";
import keyboard from "./keyboard";
import Fonts from "./Fonts";

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

  // Функция поиска ID
  findID = (clone) => {
    if (this.obj === null) return;
    if (!clone) {
      const reg = this.obj.target.id.replace(/\D/gm, "");
      const ID = this.objects.find((i) => i.id === Number(reg));
      return ID;
    } else {
      const ID = this.objects.find((i) => i.id === 9999);
      return ID;
    }
  };
  // выбрать шаблон
  select = async () => {
    this.reset();
    this.objects = [...this.objects_preview];
    console.log(this.objects);
    setTimeout(() => {
      this.objects.forEach((b) => {
        if (b.typeObj === "block") {
          const block = document.getElementById(`${b.id}`);
          block.innerHTML = b.body.replace(/\n/g, `<br>`);
          console.log("block", block.innerHTML, b);
        }
      });
    }, 500);
  };
  getObject = (e) => {
    this.obj = e;
  };
  getCoordClone = (x, canvasX, y, canvasY, lblRef) => {
    const ID = this.findID(true);
    // console.log(Memory.button_left_press);

    if (ID) {
      if (ID.editSize || ID.editSizeW || ID.editSizeH) return;
      if (!ID.editSize) {
        if (!Memory.button_left_press) return;
        // x
        if (
          x - canvasX - this.obj.nativeEvent.layerX > 0 &&
          lblRef.current.getBoundingClientRect().width - 3 >
            x -
              canvasX -
              this.obj.nativeEvent.layerX +
              this.obj.nativeEvent.target.clientWidth
        ) {
          ID.pxX =
            (x -
              (canvasX - Memory.ref_x * Memory.mm) -
              this.obj.nativeEvent.layerX) /
            Memory.scale;
          ID.pxFakeX = ID.pxX;
          ID.x = ID.pxX - Memory.ref_x * Memory.mm;
        }
        // y
        if (
          y - canvasY - this.obj.nativeEvent.layerY > 0 &&
          lblRef.current.getBoundingClientRect().height - 3 >
            y -
              canvasY -
              this.obj.nativeEvent.layerY +
              this.obj.nativeEvent.target.clientHeight
        ) {
          ID.pxY =
            (y -
              (canvasY - Memory.ref_y * Memory.mm) -
              this.obj.nativeEvent.layerY) /
            Memory.scale;
          ID.y = ID.pxY - Memory.ref_y * Memory.mm;
          ID.pxFakeY = ID.pxY;
        }
      }
    }
  };
  //   Вычисление X и Y при перимещение
  getCoordXY = (collision) => {
    const ID = this.findID();
    if (ID) {
      if (!Memory.button_left_press) return;
      // if (ID.editSize || ID.editSizeW || ID.editSizeH) return;
      const clone = this.objects.find((f) => f.id === 9999);
      if (clone) {
        console.log(clone);
        if (!collision) {
          ID.pxX = clone.pxX;
          ID.pxY = clone.pxY;
        } else {
          ID.pxX = (Memory.mm * clone.pxX - 1) / Memory.mm;
          ID.pxY = (Memory.mm * clone.pxY - 1) / Memory.mm;
        }
        this.fakeCoord();
        ID.x = clone.x / Memory.mm;
        ID.y = clone.y / Memory.mm;
      }
    }
  };
  // пересчитать координаты относительно масштаба
  // recalculationScaleCoord = (value) => {
  //   this.objects.forEach((obj) => {
  //     // if (value === "1") {
  //     // obj.pxX = obj.x * value * Memory.mm;
  //     // obj.pxY = obj.y * Memory.mm * value;
  //     // } else {
  //     // obj.pxX = obj.x * Memory.mm * value + (obj.w * value) / 2;
  //     // obj.pxY = obj.y * Memory.mm * value + (obj.h * value) / 2;
  //     // }
  //   });
  // };
  // Ручная смена X координат
  manualX = (coord) => {
    const ID = this.findID();
    if (ID) {
      ID.pxX = coord;
      this.fakeCoord();
      ID.x = coord / Memory.mm;
    }
  };
  // Ручная смена Y координат
  manualY = (coord) => {
    const ID = this.findID();
    if (ID) {
      ID.pxY = coord;
      this.fakeCoord();
      ID.y = coord / Memory.mm;
    }
  };
  //Ручная смена ширины
  manualW = (coord) => {
    const reg = this.obj.target.id.replace(/\D/gm, "");
    const ID = this.objects.find((el) => el.id === Number(reg));
    console.log(this.obj);
    if (ID) {
      console.log(coord);
      ID.pxW = coord;
      ID.w = coord;
      if (ID.typeBarcode === "datamatrix" || ID.typeBarcode === "qrcode") {
        ID.pxH = coord;
        ID.h = coord;
      }
    }
  };
  //Ручная смена высоты
  manualH = (coord) => {
    const ID = this.findID();
    if (ID) {
      console.log("ID", ID);
      ID.pxH = coord;
      ID.h = coord;
      if (ID.typeBarcode === "datamatrix" || ID.typeBarcode === "qrcode") {
        ID.pxW = coord;
        ID.w = coord;
      }
    }
  };
  // Получение клоном ширины и высоты
  getAttributeClone = (x, y, lblRef) => {
    const cloneID = this.findID(true);
    if (cloneID) {
      if (
        cloneID.style.rotate === "90" ||
        cloneID.style.rotate === "180" ||
        cloneID.style.rotate === "270" ||
        cloneID.typeBarcode === "datamatrix" ||
        cloneID.typeBarcode === "ean13" ||
        cloneID.typeBarcode === "code128"
      ) {
        return;
      } else if (cloneID.editSizeW) {
        // if (cloneID.typeObj !== "box") {
        if ((x - this.obj.target.getBoundingClientRect().x) / Memory.mm < 3) {
          return;
        }
        cloneID.pxW =
          (x - this.obj.target.getBoundingClientRect().x) /
          Memory.mm /
          Memory.scale;

        if (
          lblRef.current.getBoundingClientRect().x +
            lblRef.current.getBoundingClientRect().width -
            x <
          5
        ) {
          cloneID.pxW =
            (cloneID.pxW * Memory.mm - 1) / Memory.mm / Memory.scale;
        }
        // }
        // else {
        //   if (x - this.obj.target.getBoundingClientRect().x < 3) {
        //     return;
        //   }
        //   cloneID.pxW =
        //     (x - this.obj.target.getBoundingClientRect().x) / Memory.scale;

        //   if (
        //     lblRef.current.getBoundingClientRect().x +
        //       lblRef.current.getBoundingClientRect().width -
        //       x <
        //     5
        //   ) {
        //     cloneID.pxW = (cloneID.pxW * Memory.mm - 1) / Memory.scale;
        //   }
        // }

        cloneID.w = cloneID.pxW;
        if (
          (cloneID.typeBarcode !== "datamatrix" ||
            cloneID.typeBarcode !== "qrcode") &&
          keyboard.shift_key
        ) {
          cloneID.pxH = (cloneID.pxW * Memory.coefficient_w) / Memory.scale;
          cloneID.h = cloneID.w * Memory.coefficient_w;
        } else if (
          cloneID.typeBarcode === "datamatrix" ||
          cloneID.typeBarcode === "qrcode"
        ) {
          cloneID.h = cloneID.w;
          cloneID.pxH = cloneID.pxW;
        }
      }
      if (cloneID.editSizeH && cloneID.typeObj !== "lines") {
        // if (cloneID.typeObj !== "box") {
        if ((y - this.obj.target.getBoundingClientRect().y) / Memory.mm < 3) {
          return;
        } else
          cloneID.pxH =
            (y - this.obj.target.getBoundingClientRect().y) /
            Memory.mm /
            Memory.scale;

        if (
          lblRef.current.getBoundingClientRect().y +
            lblRef.current.getBoundingClientRect().height -
            y <
          5
        ) {
          cloneID.pxH =
            (cloneID.pxH * Memory.mm - 1) / Memory.mm / Memory.scale;
        }
        // }
        // else {
        //   if (y - this.obj.target.getBoundingClientRect().y < 3) {
        //     return;
        //   } else
        //     cloneID.pxH =
        //       (y - this.obj.target.getBoundingClientRect().y) / Memory.scale;

        //   if (
        //     lblRef.current.getBoundingClientRect().y +
        //       lblRef.current.getBoundingClientRect().height -
        //       y <
        //     5
        //   ) {
        //     cloneID.pxH = (cloneID.pxH * Memory.mm - 1) / Memory.scale;
        //   }
        // }

        cloneID.h = cloneID.pxH;
        if (
          (cloneID.typeBarcode !== "datamatrix" ||
            cloneID.typeBarcode !== "qrcode") &&
          keyboard.shift_key
        ) {
          cloneID.pxW = cloneID.pxH * Memory.coefficient_h;
          cloneID.w = cloneID.h * Memory.coefficient_h;
        } else if (
          cloneID.typeBarcode === "datamatrix" ||
          cloneID.typeBarcode === "qrcode"
        ) {
          cloneID.w = cloneID.h;
          cloneID.pxW = cloneID.pxH;
        }
      }
    }
  };
  //
  saveAttributeWH = () => {
    const ID = this.findID();
    if (ID) {
      const clone = this.findID(true);
      if (clone) {
        ID.pxW = clone.pxW;
        ID.pxH = clone.pxH;
        ID.w = clone.w;
        ID.h = clone.h;
      }
    }
  };
  //   Изменение переменной масштабирования
  getFlagEditSize = (boolean, booleanW, booleanH) => {
    const ID = this.findID();
    if (ID) {
      ID.editSize = boolean;
      ID.editSizeW = booleanW;
      ID.editSizeH = booleanH;
    }
  };
  //   Редактирвоание body
  editBody = (body) => {
    const ID = this.findID();
    if (ID && body !== undefined) {
      if (ID.typeObj !== "block") {
        ID.body = body;
      } else {
        // const bloks = document.querySelectorAll(
        //   ".bardcode_container-block-preview"
        // );
        // console.log(bloks, "bloks");

        if (body.length === 0) {
          this.obj.target.innerHTML = " ";
          ID.body = " ";
        } else {
          ID.body = body;
          this.obj.target.innerHTML = body.replace(/\n/g, `<br>`);
        }
        this.editBodyPreview();
      }
    }
  };
  editBodyPreview = () => {
    const bloksPreview = document.querySelectorAll(
      ".bardcode_container-block-preview"
    );
    console.log(bloksPreview);
    const bloks = document.querySelectorAll(".bardcode_container-block");

    bloks.forEach((b) => {
      console.log(b.id);
      bloksPreview.forEach((bp) => {
        if (bp.id === b.id) {
          bp.innerHTML = b.innerHTML;
        }
      });
    });
  };
  // Изменить ID img
  upDateImgID = (id) => {
    const ID = this.findID();
    if (ID && id !== undefined) {
      ID.image_id = id;
    }
  };
  //   Изменить размер текста в боди
  updateFontSize = (size) => {
    const ID = this.findID();
    if (ID && size !== undefined) {
      ID.style.fontSize = size;
    }
  };
  //   Изменить толщину линии box
  updateLine = (size) => {
    const ID = this.findID();
    if (ID && size !== undefined) {
      ID.line_thickness = size;
    }
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
    if (obj !== null) {
      this.prop_obj = obj;
      if (
        this.prop_obj.typeBarcode === "ean13" ||
        this.prop_obj.typeBarcode === "code128"
      ) {
        obj.pxW = this.obj.target.offsetWidth / Memory.mm;
      }
    }
  };
  //   Очистка массива
  reset = async () => {
    this.obj = null;
    this.objects = [];
  };
  //   Новый шаблон
  newTemplate = () => {
    this.obj = null;
    this.objects = [];
    Templates.preview_templates = {};
    this.resetPreiew();
  };
  //   Удалить объект из массива
  deleteObject = () => {
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
    const ID = this.findID();
    if (ID) {
      ID.style.fontFamily = family.name;
      ID.font_family_id = family.id;
    }
  };
  // Стартовая установка шрифта объекту
  // startSetFontFamily = (id) => {
  //   const objID = this.objects.find((o) => o.id === id);
  //   if (objID) {
  //     console.log(Fonts.default_font.name);
  //     objID.style.fontFamily = Fonts.default_font.name;
  //     objID.font_family_id = Fonts.default_font.id;
  //   }
  // };
  //   Изменение позиции
  textAlign = (position) => {
    const ID = this.findID();
    if (ID) {
      console.log(position);
      ID.style.position = position;
    }
  };
  //   Изменение позиции
  updateRotate = (deg) => {
    const ID = this.findID();
    if (ID) {
      if (ID.typeObj === "lines") {
        console.log(ID.style.rotate, deg);
        if (
          ((deg === "90" || deg === "270") &&
            (String(ID.style.rotate) === "180" ||
              String(ID.style.rotate) === "0")) ||
          ((deg === "0" || deg === "180") &&
            (String(ID.style.rotate) === "90" ||
              String(ID.style.rotate) === "270"))
        ) {
          const w = ID.w;
          const h = ID.h;
          this.manualW(h);
          this.manualH(w);
          console.log(this.obj);
        }
      }
      // if (ID.typeObj === "block") {
      //   const w = ID.w;
      //   const h = ID.h;
      //   this.manualW(h);
      //   this.manualH(w);
      // }
      ID.style.rotate = deg;
      if (ID.typeObj !== "lines") {
        this.fakeCoord();
      }
    }
  };
  // Запись фековых координат
  fakeCoord = () => {
    const ID = this.findID();
    if (ID) {
      if (ID.typeObj !== "block") {
        if (String(ID.style.rotate) === "0") {
          ID.pxFakeX = ID.pxX;
          ID.pxFakeY = ID.pxY;
        }
        if (String(ID.style.rotate) === "90") {
          ID.pxFakeX = ID.pxX - (ID.pxW / 2 + ID.pxH / 2) * Memory.mm;
          ID.pxFakeY = ID.pxY + (ID.pxW / 2 - ID.pxH / 2) * Memory.mm;
        }
        if (String(ID.style.rotate) === "270") {
          ID.pxFakeX = ID.pxX - (ID.pxW / 2 - ID.pxH / 2) * Memory.mm;
          ID.pxFakeY = ID.pxY - (ID.pxH / 2 + ID.pxW / 2) * Memory.mm;
        }
        if (String(ID.style.rotate) === "180") {
          ID.pxFakeX = ID.pxX - ID.pxW * Memory.mm;
          ID.pxFakeY = ID.pxY - ID.pxH * Memory.mm;
        }
      } else {
        if (String(ID.style.rotate) === "90") {
          ID.pxFakeX = ID.pxX + (ID.pxH / 2 - ID.pxW / 2) * Memory.mm;
          ID.pxFakeY = ID.pxY + (ID.pxW / 2 - ID.pxH / 2) * Memory.mm;
        } else if (String(ID.style.rotate) === "180") {
          ID.pxFakeX = ID.pxX - ID.pxW * Memory.mm;
          ID.pxFakeY = ID.pxY - ID.pxH * Memory.mm;
        } else if (String(ID.style.rotate) === "270") {
          ID.pxFakeX = ID.pxX - (ID.pxW / 2 - ID.pxH / 2) * Memory.mm;
          ID.pxFakeY = ID.pxY - (ID.pxH / 2 + ID.pxW / 2) * Memory.mm;
        } else {
          ID.pxFakeX = ID.pxX;
          ID.pxFakeY = ID.pxY;
        }
      }
    }
  };
  // Записать имя
  saveName = (name) => {
    const ID = this.findID();
    if (ID) {
      ID.name = name;
    }
  };
  // Активировать или деактивировать объект
  activeObj = (boolean) => {
    const ID = this.findID();
    if (ID) {
      ID.active = boolean;
    }
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
    const ID = this.findID();
    if (ID) {
      ID.zIndex = 5;
    } else {
      ID.zIndex = 2;
    }
  };

  humanReadable = (int) => {
    const ID = this.findID();
    if (ID) {
      console.log(int);
      ID.human_readable = int;
    }
  };

  humanReadableFlag = (boleean) => {
    const ID = this.findID();
    if (ID) {
      ID.human_readable_visible = boleean;
    }
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

  boxRadius = (int) => {
    const ID = this.findID();
    if (ID) {
      console.log(int);
      ID.borderRadius = int;
    }
  };
}

export default new Object();
