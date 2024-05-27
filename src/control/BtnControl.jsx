import { useEffect } from "react";
import Object from "../store/Object";
import HistoryStore from "../store/HistoryStore";

export const BtnControl = ({ inputPropRef }) => {
  const keyList = [];

  const pressKey = (e) => {
    console.log(e);
    if (e.repeat) return;
    if (Object.obj !== null) {
      if (e.key === "Delete" && (e.target.localName !== "input" && e.target.localName !== "textarea")) {
        Object.deleteObject();
      }
      if (e.key === "Control") {
        keyList.push(e.key);
      }
      if (
        (e.key === "z" || e.key === "я") &&
        keyList.includes("Control") &&
        keyList.length === 1
      ) {
        HistoryStore.incrementReturnHistory();
      }
      if (
        (e.key === "y" || e.key === "н") &&
        keyList.includes("Control") &&
        keyList.length === 1
      ) {
        HistoryStore.decrementReturnHistory();
      }
    }
  };

  const upKey = (e) => {
    if (Object.obj !== null) {
      if (e.key === "Control") {
        keyList.length = 0;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", pressKey);
    document.addEventListener("keyup", upKey);
    return () => {
      document.removeEventListener("keydown", pressKey);
      document.removeEventListener("keyup", upKey);
    };
  }, []);
};
