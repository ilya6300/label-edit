import React, { useRef, useState } from "react";
import { BtnVer1 } from "../../UI/btn/BtnVer1";
import Memory from "../../store/Memory";
import { observer } from "mobx-react-lite";
import Object from "../../store/Object";
import Fonts from "../../store/Fonts";
import Msg from "../../store/Msg";
import service from "../../request/service";
import Theme from "../../store/Theme";
import DMcollection from "../../store/DMcollection";

export const ImportCompanent = observer(
  ({ setImportC, selectedDM, setSelectedDM }) => {
    const refTextImport = useRef();

    const removeSpace = (string) => {
      return string.replace(/ |mm/g, "");
    };

    const regAttributeLabel = (string, flagTwo) => {
      if (!flagTwo) {
        const regString = new RegExp(`${string}\\d*`);
        const regEquation = String(
          removeSpace(refTextImport.current.value).match(regString)
        );
        if (regString) {
          if (regEquation === "DIRECTION0") {
            return 1;
          }
          return Number(regEquation.match(/\d{2}|\d/));
        }
      } else {
        const regCheckDirection = new RegExp(`${string}.*`);
        // const regString = new RegExp(`${string}\\d*,\\d*`);
        const regString = new RegExp(`${string}\\d*(\\w*\\.\\d*\\w*)?,\\d*`);
        const regEquation = String(
          removeSpace(refTextImport.current.value).match(regString)
        );
        console.log(
          "regAttributeLabel",
          regString,
          string,
          refTextImport.current.value,
          regEquation
        );
        if (
          String(
            removeSpace(refTextImport.current.value).match(regCheckDirection)
          ) === "DIRECTION0"
        ) {
          return Memory.labelDirection2(0);
        } else {
          if (regEquation.match(`\\.`)) {
            console.log("1111 ===> .....");
            const regReplaceOne = String(regEquation.match(`\\d*(,\\.\\d)?$`));
            const regReplaceTwo = regReplaceOne.match(`^\\d*`);
            console.log("=====>", String(regReplaceTwo));
            return String(regReplaceTwo);
          } else {
            const regReplace = new RegExp(`${string}\\d*,`);
            const h = regEquation.replace(regReplace, "");
            console.log(h.replace(/[,.]/g, ""));
            return h.replace(/[,.]/g, "");
          }
        }
      }
    };

    const createID = () => {
      let num = 1;
      while (num <= Object.objects.length) {
        num++;
      }
      Object.objects.forEach((obj) => {
        if (obj.id === num) {
          num++;
        }
      });
      return num;
    };

    const regAttributeElement = (string, reg, el) => {
      const regStringEl = new RegExp(`${string}${reg}`);
      const regEquation = String(removeSpace(el).match(regStringEl));
      return Number(regEquation.match(/\d{1,4}$/g));
    };

    // const regDMRchange = (el) => {
    //   if (el.match(/,r\d{1,3}/g)) {
    //     const string = el.replace(/,r\d{1,3}/g, "");
    //     const regString = String(
    //       string.match(/\d*,\d*,\d*,\d*,[Cc]126,x\d*,\d{1,3}/)
    //     );
    //     return Number(regString.match(/\d{1,4}$/g));
    //   } else {
    //     const regString = String(
    //       el.match(/\d*,\d*,\d*,\d*,[Cc]126,x\d*,\d{1,3}/)
    //     );
    //     return Number(regString.match(/\d{1,4}$/g));
    //   }
    // };

    const regBodyElement = (string, reg, el, text) => {
      const regStringEl = new RegExp(`${string}${reg}`);

      if (el.match(/@1/)) return "@1";
      if (text) {
        const regBody = String(
          el.match(/"[{}A-Za-zА-Яа-я\sьЬъЪёЁйЙыЫ\d!?-_:;,.]*"$/)
        );
        return String(regBody.replace(/"$|"$\s|^"|\s^"/g, ""));
      } else {
        const regEquation = String(removeSpace(el).match(reg));

        const regBody = String(regEquation.match(/".*"$/g));
        return String(regBody.replace(/"$|"$\s|^"|\s^"/g, ""));
      }
    };

    const datamatrixElement = async (obj, el) => {
      // dm
      obj.x =
        (regAttributeElement("DMATRIX", `\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxX = obj.x;
      obj.y =
        (regAttributeElement("DMATRIX", `\\d*,\\d*`, el) * Memory.mm) /
        Memory.dpi;
      obj.pxY = obj.y;
      // obj.w = regAttributeElement("DMATRIX", `\\d*,\\d*,\\d*`, el);
      if (
        regAttributeElement(
          "DMATRIX",
          `\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*`,
          el
        ) === 0
      ) {
        console.log(111111);

        obj.w = 6;
      } else {
        console.log(22222);
        obj.w = regAttributeElement(
          "DMATRIX",
          `\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*`,
          el
        );
      }
      obj.h = obj.w;
      obj.size = obj.w;
      obj.min_size = obj.w / Memory.dpi;
      obj.pxW = obj.w;
      obj.pxH = obj.w;
      obj.style.rotate = String(
        regAttributeElement(
          "DMATRIX",
          `\\d*,\\d*,\\d*,\\d*,[Cc]126,x\\d*,r\\d*`,
          el
        )
      );
      obj.body = regBodyElement("DMATRIX", `".*"`, el);
      obj.fakeBody = fakeBodyDM;
    };

    const textElement = (obj, el) => {
      obj.x = regAttributeElement("TEXT", `\\d*`, el) / Memory.dpi;
      obj.pxFakeX = obj.x * Memory.mm;
      obj.pxX = obj.x * Memory.mm;
      obj.y = regAttributeElement("TEXT", `\\d*,\\d*`, el) / Memory.dpi;
      obj.pxFakeY = obj.y * Memory.mm;
      obj.pxY = obj.y * Memory.mm;
      obj.font_family_id = Fonts.default_font.id;
      if (Number(regAttributeElement("TEXT", `\\d*,\\d*,"\\d*`, el)) === 2) {
        obj.style.fontSize = 7;
      } else if (
        Number(regAttributeElement("TEXT", `\\d*,\\d*,"\\d*`, el)) === 0
      ) {
        obj.style.fontSize = 12;
      } else if (
        Number(regAttributeElement("TEXT", `\\d*,\\d*,"\\d*`, el)) === 1
      ) {
        obj.style.fontSize = 6;
      } else if (
        Number(regAttributeElement("TEXT", `\\d*,\\d*,"\\d*`, el)) === 3
      ) {
        obj.style.fontSize = 8;
      } else if (
        Number(regAttributeElement("TEXT", `\\d*,\\d*,"\\d*`, el)) === 4
      ) {
        obj.style.fontSize = 12;
      }
      obj.w = 12;
      obj.pxW = 12;
      obj.h = 6;
      obj.pxH = 6;
      obj.fontFamily = "0";
      Msg.writeMessages(
        "В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента."
      );
      obj.style.rotate = regAttributeElement(
        "TEXT",
        `\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
        el
      );
      obj.body = regBodyElement(
        "TEXT",
        `\\d*,\\d*,"[А-Яа-яьЬъЪыЫёЁйЙA-Za-z-_\\d.]*",\\d*,\\d*,\\d*,\\d?,(".+")|@1`,
        el,
        true
      );
    };

    const blockElement = (obj, el) => {
      obj.x = regAttributeElement("BLOCK", `\\d*`, el) / Memory.mm;
      obj.pxFakeX = obj.x;
      obj.pxX = obj.x;
      obj.y = regAttributeElement("BLOCK", `\\d*,\\d*`, el) / Memory.dpi;
      obj.pxFakeY = obj.y * Memory.mm;
      obj.pxY = obj.y * Memory.mm;
      obj.w = regAttributeElement("BLOCK", `\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.h =
        regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.pxW = obj.w;
      obj.pxH = obj.h;
      obj.font_family_id = Fonts.default_font.id;
      obj.fontFamily = "0";
      Msg.writeMessages(
        "В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента."
      );
      if (
        regAttributeElement(
          "BLOCK",
          `\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
          el
        ) === 0
      ) {
        obj.style.rotate = 0;
      } else if (
        regAttributeElement(
          "BLOCK",
          `\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
          el
        ) === 1
      ) {
        obj.style.rotate = "90";
      } else if (
        regAttributeElement(
          "BLOCK",
          `\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
          el
        ) === 2
      ) {
        obj.style.rotate = "180";
      } else if (
        regAttributeElement(
          "BLOCK",
          `\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*`,
          el
        ) === 3
      ) {
        obj.style.rotate = "270";
      }
      obj.style.position = String(
        regAttributeElement(
          "BLOCK",
          `\\d*,\\d*,\\d*,\\d*,"[\\dA-Za-z]",\\d*,\\d*,\\d*,\\d*`,
          el
        )
      );
      if (
        Number(
          regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
        ) === 2
      ) {
        obj.style.fontSize = 7;
      } else if (
        Number(
          regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
        ) === 0
      ) {
        obj.style.fontSize = 12;
      } else if (
        Number(
          regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
        ) === 1
      ) {
        obj.style.fontSize = 6;
      } else if (
        Number(
          regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
        ) === 3
      ) {
        obj.style.fontSize = 8;
      } else if (
        Number(
          regAttributeElement("BLOCK", `\\d*,\\d*,\\d*,\\d*,"\\d*`, el)
        ) === 4
      ) {
        obj.style.fontSize = 12;
      }
      obj.body = regBodyElement(
        "BLOCK",
        `\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?"[А-Яа-яьЬъЪыЫёЁйЙA-Za-z-_\\d.]+"\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?\\d*\\s?,\\s?".*"\\s?`,
        el,
        true
      );
    };

    const putbmpElement = (obj, el) => {
      obj.x =
        (regAttributeElement("PUTBMP", `\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxX = obj.x;
      obj.y =
        (regAttributeElement("PUTBMP", `\\d*,\\d*`, el) * Memory.mm) /
        Memory.dpi;
      obj.pxY = obj.y;
      Msg.writeMessages(
        "Изображение не загружено, пожалуйста, передобавьте его вручную."
      );
    };

    const barcodeElement = (obj, el, barcode) => {
      obj.x = regAttributeElement("BARCODE", `\\d*`, el) / Memory.dpi;
      obj.pxFakeX = obj.x * Memory.mm;
      obj.pxX = obj.x * Memory.mm;
      obj.y = regAttributeElement("BARCODE", `\\d*,\\d*`, el) / Memory.dpi;
      obj.pxFakeY = obj.y * Memory.mm;
      obj.pxY = obj.y * Memory.mm;
      obj.h =
        regAttributeElement("BARCODE", `\\d*,\\d*,"${barcode}",\\d*`, el) /
        Memory.dpi;
      obj.pxH = Math.round(obj.h);
      obj.human_readable = regAttributeElement(
        "BARCODE",
        `\\d*,\\d*,"${barcode}",\\d*,\\d`,
        el
      );
      obj.style.position = Number(
        regAttributeElement("BARCODE", `\\d*,\\d*,"${barcode}",\\d*,\\d`, el)
      );
      obj.style.rotate = regAttributeElement(
        "BARCODE",
        `\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*`,
        el
      );
      obj.w = regAttributeElement(
        "BARCODE",
        `\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*,\\d`,
        el
      );
      // obj.pxW = obj.w;
      obj.body = regBodyElement(
        "BARCODE",
        `\\d*,\\d*,"${barcode}",\\d*,\\d,\\d*,\\d,"\\d*"`,
        el,
        true
      );
      if (barcode === "EAN13") {
        obj.fakeBody = "978020137962";
      } else if (barcode === "128") {
        obj.fakeBody = "barcode046037210206";
      }
    };

    const barElement = (obj, el) => {
      obj.x = (regAttributeElement("BAR", `\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxFakeX = obj.x;
      obj.y =
        (regAttributeElement("BAR", `\\d*,\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxFakeY = obj.y;
      obj.w = regAttributeElement("BAR", `\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.pxW = obj.w;
      obj.h =
        regAttributeElement("BAR", `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.pxH = obj.h;
    };

    const qrcodeElement = (obj, el) => {
      obj.x = regAttributeElement("QRCODE", `\\d*`, el) / Memory.dpi;
      obj.pxFakeX = obj.x * Memory.mm;
      obj.pxX = obj.x * Memory.mm;
      obj.y = regAttributeElement("QRCODE", `\\d*,\\d*`, el) / Memory.dpi;

      obj.style.rotate = regAttributeElement(
        "QRCODE",
        `\\d*,\\d*,[L|M|Q|H],\\d,[A|M]\\d*`,
        el
      );
      obj.pxFakeY = obj.y * Memory.mm;
      obj.pxY = obj.y * Memory.mm;
      obj.body = regBodyElement(
        "QRCODE",
        `\\d*,\\d*,[L?|M?|Q?|H?],\\d*,[A?|M?],\\d*,\\w{2}?,\\w{2}?,".*"`,
        el
      );
      obj.fakeBody = "barcode046037210206";
    };

    const boxElement = (obj, el) => {
      obj.x = (regAttributeElement("BOX", `\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxX = obj.x;
      obj.y =
        (regAttributeElement("BOX", `\\d*,\\d*`, el) * Memory.mm) / Memory.dpi;
      obj.pxY = obj.y;
      obj.w = regAttributeElement("BOX", `\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.pxW = obj.w;
      obj.h =
        regAttributeElement("BOX", `\\d*,\\d*,\\d*,\\d*`, el) / Memory.dpi;
      obj.pxH = obj.h;
      obj.line_thickness = regAttributeElement(
        "BOX",
        `\\d*,\\d*,\\d*,\\d*,\\d*`,
        el
      );
      obj.borderRadius = regAttributeElement(
        "BOX",
        `\\d*,\\d*,\\d*,\\d*,\\d*,\\d*`,
        el
      );
    };

    const regElement = (string) => {
      const el = String(string.match(/^[A-Z]*/));
      if (el) {
        const obj = {
          id: createID(),
          zIndex: 2,
          active: true,
          editSize: false,
          editSizeW: false,
          editSizeH: false,
          style: {
            boxShadow: "none",
          },
        };
        // DataMatrix
        if (el === "DMATRIX") {
          obj.name = "datamatrix";
          obj.typeObj = "barcode";
          obj.typeBarcode = "datamatrix";
          datamatrixElement(obj, string);
          setSelectedDM(true);
          // Text
        } else if (el === "TEXT") {
          obj.name = "text";
          obj.typeObj = "text";
          obj.w = "fit-content";
          obj.h = "fit-content";
          obj.pxW = "fit-content";
          obj.pxH = "fit-content";
          textElement(obj, string);
          obj.cls = ["bardcode_container-text "];
          obj.clsPreview = "bardcode_container-text-preview";
          obj.style.fontFamily = Fonts.default_font.name;
          // Block
        } else if (el === "BLOCK") {
          obj.name = "block";
          obj.typeObj = "block";
          obj.cls = ["bardcode_container-block "];
          obj.clsPreview = "bardcode_container-block-preview";
          obj.style.fontFamily = Fonts.default_font.name;
          blockElement(obj, string);
          // Barcode
        } else if (el === "BARCODE") {
          // obj.style.fontSize = 12;
          // Ean13
          if (string.match(/EAN13/)) {
            obj.name = "barcode";
            obj.typeObj = "barcode";
            obj.typeBarcode = "ean13";
            barcodeElement(obj, string, "EAN13");
            obj.human_readable_visible = false;
          } else if (string.match(/128/)) {
            obj.name = "barcode";
            obj.typeObj = "barcode";
            obj.typeBarcode = "code128";

            barcodeElement(obj, string, "128");
            obj.human_readable_visible = false;
          } else {
            return Msg.writeMessages("Найдена ошибка в типе barcode");
          }
        } else if (el === "PUTBMP") {
          obj.name = "img";
          obj.typeObj = "img";
          obj.body = "#";
          obj.id = 999;
          obj.w = 10;
          obj.h = 10;
          obj.pxW = 10;
          obj.pxH = 10;
          putbmpElement(obj, string);
          obj.cls = ["bardcode_container-barcode"];
          obj.clsPreview = "bardcode_container-barcode-preview";
        } else if (el === "BAR") {
          obj.name = "Линия";
          obj.typeObj = "bar";
          obj.cls = ["bardcode_container-barcode"];
          obj.clsPreview = "bardcode_container-barcode-preview";
          barElement(obj, string);
        } else if (el === "BOX") {
          obj.name = "Бокс";
          obj.typeObj = "box";
          obj.cls = ["bardcode_container-barcode"];
          obj.clsPreview = "bardcode_container-barcode-preview";
          boxElement(obj, string);
        } else if (el === "QRCODE") {
          obj.name = "qrcode";
          obj.typeObj = "barcode";
          obj.typeBarcode = "qrcode";
          obj.cls = ["bardcode_container-barcode"];
          obj.clsPreview = "bardcode_container-barcode-preview";
          obj.w = 10;
          obj.h = 10;
          obj.pxW = 10;
          obj.pxH = 10;
          qrcodeElement(obj, string);
        } else {
          return;
        }
        if (obj.typeObj === "barcode") {
          obj.cls = ["bardcode_container-barcode"];
          obj.clsPreview = "bardcode_container-barcode-preview";
        }
        Object.addObj(obj);
      }
    };

    const importStringTemplate = () => {
      if (refTextImport.current.value < 10) {
        return;
      }
      try {
        if (refTextImport.current.value.match("SIZE")) {
          // Атрибуты этикетки
          if (
            regAttributeLabel("DIRECTION") < 0 ||
            regAttributeLabel("DIRECTION") > 1
          ) {
            return Msg.writeMessages(
              `Неверное значение значение derection по x-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${regAttributeLabel(
                "DIRECTION"
              )} в шаблон`
            );
          } else {
            Memory.labelDirection1(regAttributeLabel("DIRECTION"));
          }
          if (
            regAttributeLabel("DIRECTION") < 0 ||
            regAttributeLabel("DIRECTION") > 1
          ) {
            return Msg.writeMessages(
              `Неверное значение значение derection по y-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${regAttributeLabel(
                "DIRECTION"
              )} в шаблон`
            );
          }
          // else {
          //   Memory.labelDirection2(regAttributeLabel("DIRECTION", true));
          // }
          if (
            regAttributeLabel("SIZE") < 15 ||
            regAttributeLabel("SIZE") > 150
          ) {
            return Msg.writeMessages(
              `Неверное значение ширины. Нижний порог ширины 15мм, верхний 150мм. Вы пытаетесь записать значение ${regAttributeLabel(
                "SIZE"
              )}`
            );
          } else {
            Memory.widthLabelChange(regAttributeLabel("SIZE"));
          }
          if (
            regAttributeLabel("SIZE", true) < 15 ||
            regAttributeLabel("SIZE", true) > 400
          ) {
            return Msg.writeMessages(
              `Неверное значение высоты. Нижний порог высоты 15мм, верхний 150мм. Вы пытаетесь записать значение ${regAttributeLabel(
                "SIZE",
                true
              )}`
            );
          } else {
            Memory.heigthLabelChange(regAttributeLabel("SIZE", true));
          }
          if (regAttributeLabel("GAP") < 0 || regAttributeLabel("GAP") > 30) {
            return Msg.writeMessages(`Неверное значение gap.}`);
          } else {
            Memory.gapLabelChange(regAttributeLabel("GAP"));
          }
          Memory.labelRefX(regAttributeLabel("REFERENCE"));
          // Memory.labelRefY(regAttributeLabel("REFERENCE", true));
        }

        // Объекты
        const elemets = new RegExp(
          `DMATRIX.*|TEXT.*|BLOCK.*|EAN13.*|CODE128.*|QRCODE.*|PUTBMP.*|BOX.*|BAR.*`,
          `g`
        );
        console.log(refTextImport.current.value.match(elemets));
        refTextImport.current.value.match(elemets).forEach((string) => {
          console.log(string);
          regElement(string);
        });
        setImportC(false);
      } catch (e) {
        console.log(e);
      }
    };

    // Из файла
    const txtRef = useRef();

    const handlerTxtFile = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log(reader.result);
        refTextImport.current.innerHTML = reader.result;
      };
      reader.readAsText(e.target.files[0]);
      console.log(e.target.files);
    };

    const [fakeBodyDM, setFakeBodyDM] = useState(
      "0104603721020607215>(egukLfdK5r93zoJf"
    );

    return (
      <div
        className="import_container bar_label"
        style={{ background: Theme.background }}
      >
        <p className="import_container_title">Импорт шаблона</p>
        <textarea
          ref={refTextImport}
          placeholder="Скопируйте в данное поле текст шаблона для принтера, на языке TSPL или EZPL (В разработке)..."
          className="import_container_body"
        ></textarea>

        <div className="import_container_btn_container">
          <BtnVer1 onClick={importStringTemplate}>Импортировать</BtnVer1>
          <BtnVer1 onClick={() => setImportC(false)}>Закрыть </BtnVer1>
          <BtnVer1 onClick={() => txtRef.current.click()}>
            Из файла .txt{" "}
          </BtnVer1>
        </div>
        <input
          onChange={handlerTxtFile}
          className="hidden"
          ref={txtRef}
          type="file"
        />
      </div>
    );
  }
);
