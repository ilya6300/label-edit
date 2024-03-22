import React from "react";
import bwipjs from "bwip-js";
import Memory from "../../store/Memory";
import { observer } from "mobx-react-lite";

export const Barcode = observer(({ typeBarcode, body, w, h, id, active }) => {
  try {
    let canvas = bwipjs.toCanvas("mycanvas" + id, {
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
        border: 'none',
        // opacity: active ? 1 : 0.2,

      }}
    ></canvas>
  );
});
