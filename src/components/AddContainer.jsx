import React, { useState } from "react";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { ImgContainer } from "./img_components/ImgContainer";
import Fonts from "../store/Fonts";
import { Loader } from "./Loader";
import { DMContainer } from "./obj/DMContainer";

export const AddContainer = observer(() => {
  const [imgBD, setImgBD] = useState(false);
  const [dmFlag, setDmFlag] = useState(false);

  let num = 1;
  while (num <= Object.objects.length) {
    num++;
  }
  Object.objects.forEach((obj) => {
    if (obj.id === num) {
      num++;
    }
  });

  const addText = () => {
    if (Fonts.default_font === null) {
      return;
    }

    const obj = {
      id: num,
      name: "text",
      typeObj: "text",
      pxX: 0,
      pxY: 0,
      pxW: 12,
      pxH: 6,
      pxFakeX: 0,
      pxFakeY: 0,
      x: 0,
      y: 0,
      body: "Текст",
      zIndex: 2,
      w: 12,
      h: 6,
      active: true,
      cls: ["bardcode_container-text "],
      clsPreview: "bardcode_container-text-preview",
      font_family_id: Fonts.default_font.id,
      style: {
        fontSize: 12,
        fontFamily: Fonts.default_font.name,
        position: "1",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const addTextBlock = () => {
    if (Fonts.default_font === null) {
      return;
    }
    const obj = {
      id: num,
      name: "block",
      typeObj: "block",
      pxX: 0,
      pxY: 0,
      pxW: 50,
      pxH: 20,
      pxFakeX: 0,
      pxFakeY: 0,
      x: 0,
      y: 0,
      body: "Текст",
      zIndex: 2,
      w: 50,
      h: 20,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-block"],
      clsPreview: "bardcode_container-block-preview",
      font_family_id: Fonts.default_font.id,
      style: {
        fontSize: 12,
        fontFamily: Fonts.default_font.name,
        position: "1",
        rotate: 0,
        boxShadow: "none",
      },
    };

    Object.addObj(obj);
  };
  const addBarcode = (e) => {
    let barcode;
    let width;
    if (e.target.id === "ean13") {
      barcode = "978020137962";
      width = 2;
    }
    if (e.target.id === "code128") {
      barcode = "barcode046037210206";
      width = 2;
    }
    if (e.target.id === "qrcode") {
      barcode = "barcode046037210206";
      width = 10;
    }

    const obj = {
      id: num,
      human_readable: 0,
      human_readable_visible: false,
      name: "barcode",
      typeObj: "barcode",
      typeBarcode: e.target.id,
      pxX: 0,
      pxY: 0,
      pxFakeX: 0,
      pxFakeY: 0,
      pxW: width,
      pxH: 10,
      x: 0,
      y: 0,
      body: barcode,
      zIndex: 2,
      w: width,
      h: 10,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      clsPreview: "bardcode_container-barcode-preview",
      style: {
        fontSize: 12,
        position: "1",
        rotate: 0,
        boxShadow: "none",
      },
    };
    if (e.target.id !== "datamatrix") {
      Object.addObj(obj);
    } else {
      setDmFlag(true);
    }
  };

  const createImg = (data, id) => {
    const obj = {
      id: num,
      name: "img",
      typeObj: "img",
      pxX: 0,
      pxY: 0,
      pxW: 10,
      pxH: 10,
      x: 0,
      y: 0,
      body: data,
      zIndex: 2,
      w: 10,
      h: 10,
      editSizeW: false,
      editSizeH: false,
      active: true,
      image_id: id,
      cls: ["bardcode_container-barcode"],
      clsPreview: "bardcode_container-block-preview",
      style: {
        fontSize: 12,
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const addLine = () => {
    const obj = {
      id: num,
      name: "Линия",
      typeObj: "lines",
      pxX: 0,
      pxY: 0,
      pxW: 15,
      pxH: 1,
      x: 0,
      y: 0,
      body: "lines",
      zIndex: 2,
      w: 15,
      h: 1,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      clsPreview: "bardcode_container-barcode-preview",
      style: {
        fontSize: 0,
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const addBox = () => {
    const obj = {
      id: num,
      name: "Бокс",
      typeObj: "box",
      pxX: 0,
      pxY: 0,
      pxW: 15,
      pxH: 15,
      x: 0,
      y: 0,
      borderRadius: 0,
      line_thickness: 0.5,
      zIndex: 2,
      w: 15,
      h: 15,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      clsPreview: "bardcode_container-barcode-preview",
      style: {
        fontSize: 0,
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  return (
    <ul className="editor_list_obj_container">
      {Fonts.default_font !== undefined ? (
        <>
          <li className="add_obj-title">Добавить элемент</li>
          <li className="add_obj" onClick={addText}>
            Текст (строка)
          </li>
          <li className="add_obj" onClick={addTextBlock}>
            Текст (многострочный)
          </li>
          <li className="add_obj" onClick={addBarcode} id="datamatrix">
            Data Matrix
          </li>
          <li className="add_obj" onClick={addBarcode} id="ean13">
            EAN 13
          </li>
          <li className="add_obj" onClick={addBarcode} id="code128">
            code 128
          </li>
          <li className="add_obj" onClick={addBarcode} id="qrcode">
            QR code
          </li>
          <li className="add_obj" onClick={() => setImgBD(true)} id="qrcode">
            Изображение из бд
          </li>
          <li className="add_obj" onClick={addLine}>
            Линия
          </li>
          <li className="add_obj" onClick={addBox}>
            Бокс
          </li>
          {imgBD ? (
            <ImgContainer setImgBD={setImgBD} createImg={createImg} />
          ) : (
            <></>
          )}
          {dmFlag ? <DMContainer setDmFlag={setDmFlag} /> : <></>}
        </>
      ) : (
        <Loader />
      )}
    </ul>
  );
});
