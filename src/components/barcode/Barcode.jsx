import React, { useEffect, useState } from "react";
import bwipjs from "bwip-js";
import Memory from "../../store/Memory";
import { observer } from "mobx-react-lite";

export const Barcode = observer(({ obj, add_canvas }) => {
  const [body, setBody] = useState(
    obj.fakeBody.length >= 13 ? obj.fakeBody : "0000000000000"
  );
  useEffect(() => {
    try {
      if (obj.typeBarcode === "ean13" || obj.typeBarcode === "code128") {
        let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
          scaleX: obj.w,
          scaleY: 2,
          bcid: obj.typeBarcode,
          text: body,
          height: obj.h * 2,
        });
      } else if (obj.typeBarcode === "datamatrix") {
        let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
          bcid: "datamatrix",
          text: "^FNC1" + obj.fakeBody,
          height: obj.w * obj.min_size,
          width: obj.w * obj.min_size,
          parsefnc: true,
        });
      } else {
        let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
          bcid: obj.typeBarcode,
          text: obj.fakeBody,
          height: obj.h,
          width: obj.w,
        });
      }
    } catch (e) {
      console.error("Error generating barcode:", e);
    }
  }, [obj, add_canvas, body]);
  // try {
  //   if (obj.typeBarcode === "ean13" || obj.typeBarcode === "code128") {
  //     let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
  //       // scale: 2, // 3x scaling factor
  //       scaleX: obj.w,
  //       scaleY: 2,
  //       bcid: obj.typeBarcode, // Barcode type
  //       text: body, // Text to encode
  //       height: obj.h * 2,
  //     });
  //   } else if (obj.typeBarcode === "datamatrix") {
  //     let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
  //       // scale: w, // 3x scaling factor
  //       // scaleX: 1,
  //       // scaleY: 2,
  //       bcid: "datamatrix", // Barcode type
  //       text: "^FNC1" + obj.fakeBody, // Text to encode
  //       height: obj.w * obj.min_size,
  //       width: obj.w * obj.min_size,
  //       parsefnc: true,
  //     });
  //   } else {
  //     let canvas = bwipjs.toCanvas("mycanvas" + obj.id + add_canvas, {
  //       bcid: obj.typeBarcode, // Barcode type
  //       text: obj.fakeBody, // Text to encode
  //       height: obj.h,
  //       width: obj.w,
  //     });
  //   }
  // } catch (e) {
  //   // `e` may be a string or Error object
  // }
  return (
    <>
      <canvas
        id={"mycanvas" + obj.id + add_canvas}
        style={{
          height:
            obj.typeBarcode === "qrcode"
              ? obj.h * Memory.mm_qr * Memory.scale + "px"
              : obj.typeBarcode === "datamatrix" && obj.min_size === 0
              ? obj.h * 1.833 * Memory.mm * Memory.scale + "px"
              : obj.typeBarcode === "datamatrix" && obj.min_size !== 0
              ? obj.h * obj.min_size * Memory.mm * Memory.scale + "px"
              : obj.h * Memory.mm * Memory.scale + "px",
        }}
      ></canvas>
      {obj.human_readable === 1 ? (
        <p
          style={{
            textAlign: "start",
          }}
          className="barcode_body"
        >
          {obj.fakeBody}
        </p>
      ) : obj.human_readable === 2 ? (
        <p
          style={{
            textAlign: "center",
          }}
          className="barcode_body"
        >
          {obj.fakeBody}
        </p>
      ) : obj.human_readable === 3 ? (
        <p
          style={{
            textAlign: "end",
          }}
          className="barcode_body"
        >
          {obj.fakeBody}
        </p>
      ) : (
        <></>
      )}
    </>
  );
});
