import React, { useState } from "react";
import Memory from "../store/Memory";
import Object from "../store/Object";
import { observer } from "mobx-react-lite";

export const AddContainer = observer(() => {
  let num = 1;
  while (num <= Object.objects.length) {
    num++;
  }
  const addText = () => {
    const obj = {
      id: num,
      typeObj: "text",
      typeBarcode: "",
      pxX: 0,
      pxY: 0,
      pxW: 30,
      pxH: 10,
      x: 0,
      y: 0,
      body: "Текст",
      zIndex: 5,
      w: 30 * Memory.mm,
      h: 10 * Memory.mm,
      editSize: false,
      cls: "bardcode_container-text",
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
      typeObj: "barcode",
      typeBarcode: e.target.id,
      pxX: 0,
      pxY: 0,
      pxW: width,
      pxH: 10,
      x: 0,
      y: 0,
      body: barcode,
      zIndex: 5,
      w: 10 * Memory.mm,
      h: width * Memory.mm,
      editSize: false,
      cls: "bardcode_container-barcode",
    };
    Object.addObj(obj);
  };

  return (
    <ul className="editor_list_obj_container">
      <li onClick={addText}>Текст</li>
      <li onClick={addBarcode} id="datamatrix">
        Data Matrix
      </li>
      <li onClick={addBarcode} id="ean13">
        EAN 13
      </li>
      <li onClick={addBarcode} id="code128">
        code 128
      </li>
      <li onClick={addBarcode} id="qrcode">
        QR code
      </li>
    </ul>
  );
});
