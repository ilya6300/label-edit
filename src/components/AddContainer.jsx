import React, { useRef, useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";
import { ImgContainer } from "./img_components/ImgContainer";

export const AddContainer = observer(() => {
  const inpFile = useRef(null);
  const [imgBD, setImgBD] = useState(false);

  let num = 1;
  while (num <= Object.objects.length) {
    num++;
  }

  const addText = () => {
    const obj = {
      id: num,
      name: "text",
      typeObj: "text",
      typeBarcode: "",
      pxX: 0,
      pxY: 0,
      pxW: "fit-content",
      pxH: 10,
      x: 0,
      y: 0,
      body: "Текст",
      file: null,
      zIndex: 2,
      w: "fit-content",
      h: 10,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-text "],
      style: {
        fontSize: 12,
        fontFamily: "Times New Roman",
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const addTextBlock = () => {
    const obj = {
      id: num,
      name: "block",
      typeObj: "block",
      typeBarcode: "",
      pxX: 0,
      pxY: 0,
      pxW: 50,
      pxH: 20,
      x: 0,
      y: 0,
      body: "Текст",
      file: null,
      zIndex: 2,
      w: 50,
      h: 20,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-block"],
      style: {
        fontSize: 12,
        fontFamily: "Times New Roman",
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const addBarcode = (e) => {
    let barcode;
    let width;
    console.log(e.target.id);
    if (e.target.id === "datamatrix") {
      barcode = "0104603721020607215>(egukLfdK5r93zoJf";
      width = 10;
    }
    if (e.target.id === "ean13") {
      barcode = "046037210206";
      width = 30;
    }
    if (e.target.id === "code128") {
      barcode = "barcode046037210206";
      width = 30;
    }
    if (e.target.id === "qrcode") {
      barcode = "barcode046037210206";
      width = 10;
    }

    const obj = {
      id: num,
      name: "barcode",
      typeObj: "barcode",
      fontSize: 12,
      fontFamily: "none",
      typeBarcode: e.target.id,
      pxX: 0,
      pxY: 0,
      pxW: width,
      pxH: 10,
      x: 0,
      y: 0,
      body: barcode,
      file: null,
      zIndex: 2,
      w: width,
      h: 10,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      style: {
        fontSize: 12,
        fontFamily: "Times New Roman",
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };

  const createImg = (data) => {

    const obj = {
      id: num,
      name: "img",
      typeObj: "img",
      fontSize: 12,
      fontFamily: "none",
      typeBarcode: "",
      pxX: 0,
      pxY: 0,
      pxW: 10,
      pxH: 10,
      x: 0,
      y: 0,
      body: data,
      // file: e.target.files[0],
      zIndex: 2,
      w: 10,
      h: 10,
      editSize: false,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      style: {
        fontSize: 12,
        fontFamily: "Times New Roman",
        position: "left",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
  };


  return (
    <ul className="editor_list_obj_container">
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
      {/* <li className="add_obj" onClick={addImg} id="qrcode">
        Изображение input
        <input
          ref={inpFile}
          onChange={selectedFile}
          type="file"
          accept="image/.bmp"
          className="hidden"
        />
      </li> */}
      <li className="add_obj" onClick={() => setImgBD(true)} id="qrcode">
        Изображение из бд
      </li>

      {imgBD ? <ImgContainer setImgBD={setImgBD} createImg={createImg}/> : <></>}
    </ul>
  );
});
