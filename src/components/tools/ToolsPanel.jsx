import React, { useState } from "react";
import Theme from "../../store/Theme";
import zoomImg from "./../../img/icons/zoom.png";
import zoomImgActive from "./../../img/icons/zoom_active.png";
import Memory from "../../store/Memory";
import { observer } from "mobx-react-lite";
import HistoryStore from "../../store/HistoryStore";

export const ToolsPanel = observer(({ setClsMM, clsMM }) => {
  const [iconZoom, setIconTools] = useState(zoomImg);

  // Включить / отклюяить милимметровую сетку
  const [clsMMBtn, setClsMMBtn] = useState("cls_mm-btn");
  const onMM = () => {
    if (clsMM === "none") {
      setClsMMBtn("cls_mm-btn-active");
      setClsMM(`linear-gradient(rgb(114 114 114 / 75%) 1px, transparent 1px),
              linear-gradient(90deg, rgb(114 114 114 / 75%) 1px, transparent 1px),
              linear-gradient(rgb(114 114 114) 1px, transparent 1px),
              linear-gradient(90deg, rgb(114 114 114) 1px, white 1px)`);
    } else {
      setClsMMBtn("cls_mm-btn");
      setClsMM("none");
    }
  };

  const backStepHistory = () => {
    HistoryStore.incrementReturnHistory();
  };

  const cancelStepHistory = () => {
    HistoryStore.decrementReturnHistory();
  };

  return (
    <div className="tools_container">
      <div
        className="btn_tools"
        onMouseEnter={() => setIconTools(zoomImgActive)}
        onMouseLeave={() => setIconTools(zoomImg)}
        style={{ background: Theme.btn_background_black }}
      >
        <img className="img_tools" src={iconZoom} alt="zoom" />
        {iconZoom === zoomImgActive ? (
          <div
            className="barlabel_container_scale"
            style={{
              background: Theme.btn_background_black,
              border: Theme.theme_border,
            }}
          >
            <span className="barlabel_container_scale_text">Масштаб</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.25"
              value={Memory.scale}
              onChange={(e) => Memory.setScaleLabel(e.target.value)}
            />
            <span className="barlabel_container_scale_text">
              {Memory.scale * 100} %
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>
      <button
        onClick={onMM}
        className={clsMMBtn}
        style={{ background: Theme.btn_background_black }}
      >
        #
      </button>
      <span
        className="btn_back_history"
        style={{ background: Theme.btn_background_black }}
        onClick={backStepHistory}
      >
        &#8630;
      </span>
      <span
        className="btn_back_history"
        style={{ background: Theme.btn_background_black }}
        onClick={cancelStepHistory}
      >
        &#8631;
      </span>
    </div>
  );
});
