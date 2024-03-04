import React from "react";
import bwipjs from "bwip-js";
import Memory from "../../store/Memory";
import { observer } from "mobx-react-lite";

export const Barcode = observer(({ typeBarcode, body, w, h, id }) => {
  try {
    let canvas = bwipjs.toCanvas("mycanvas" + id, {
      //   bcid: "datamatrix", // Barcode type
      //   text: "0104603721020607215>(egukLfdK5r93zoJf", // Text to encode
      //   height: 10,
      //   width: 10, // Bar height, in millimeters
      // scale: 1.5, // 3x scaling factor
      bcid: typeBarcode, // Barcode type
      text: body, // Text to encode
      height: h,
      width: w, // Bar height, in millimeters
    });
  } catch (e) {
    // `e` may be a string or Error object
  }
  return (
    <canvas
      id={"mycanvas" + id}
      style={{
        height: h * Memory.mm + "px",
        width: w * Memory.mm + "px",
        border: 'none'
      }}
    ></canvas>
  );
});
