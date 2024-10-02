import { useEffect } from "react";
import Object from "../store/Object";
import HistoryStore from "../store/HistoryStore";
import Memory from "../store/Memory";

export const BtnControl = () => {
  const pressKey = (e) => {
    if (Object.obj !== null) {
      if (
        e.key === "Delete" &&
        e.target.localName !== "input" &&
        e.target.localName !== "textarea"
      ) {
        Object.deleteObject();
      } else if (
        e.key === "ArrowRight" &&
        e.target.localName !== "input" &&
        e.target.localName !== "textarea"
      ) {
        Object.manualX(Object.prop_obj.pxX + 1);
      } else if (
        e.key === "ArrowLeft" &&
        e.target.localName !== "input" &&
        e.target.localName !== "textarea"
      ) {
        Object.manualX(Object.prop_obj.pxX - 1);
      } else if (
        e.key === "ArrowUp" &&
        e.target.localName !== "input" &&
        e.target.localName !== "textarea"
      ) {
        Object.manualY(Object.prop_obj.pxY - 1);
      } else if (
        e.key === "ArrowDown" &&
        e.target.localName !== "input" &&
        e.target.localName !== "textarea"
      ) {
        Object.manualY(Object.prop_obj.pxY + 1);
      }
    }
    if (e.code === "KeyZ") {
      if (e.ctrlKey) {
        HistoryStore.incrementReturnHistory();
      }
    }
    if (e.code === "KeyY") {
      if (e.ctrlKey) {
        HistoryStore.decrementReturnHistory();
      }
    }
    if (e.key === "Escape") {
      Object.getObject(null);
      Object.setPropObj({});
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", pressKey);
    document.addEventListener("mousedown", () => Memory.pressLeftDown(true));
    document.addEventListener("mouseup", () => Memory.pressLeftUp());
    return () => {
      document.removeEventListener("keydown", pressKey);
      document.removeEventListener("mousedown", () =>
        Memory.pressLeftDown(true)
      );
      document.removeEventListener("mouseup", () => Memory.pressLeftUp());
    };
  }, []);
};
