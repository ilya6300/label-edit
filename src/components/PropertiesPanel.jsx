import React, { useState } from "react";
import { PropertiesObj } from "./PropertiesObj";
import { LayersObj } from "./LayersObj";
import { observer } from "mobx-react-lite";
import { FontsContainer } from "./obj/FontsContainer";
import { HistoryObj } from "./history/HistoryObj";

export const PropertiesPanel = observer(({ clsContainer, inputPropRef }) => {
  const [propActive, setPropActive] = useState(true);
  const [layersActive, setLayersActive] = useState(false);
  const [historyActive, setHistorysActive] = useState(false);
  // Классы кнопок
  const [clsPropActive, setClsPropActive] = useState("btn_title_props-active");
  const [clsLayersActive, setClsLayersActive] = useState("btn_title_props");
  const [clsHistoryActive, setClsHistorysActive] = useState("btn_title_props");
  //
  const [flagFonts, setFlagFonts] = useState(false);

  const propsSelect = () => {
    setPropActive(true);
    setLayersActive(false);
    setHistorysActive(false);
    setClsPropActive("btn_title_props-active");
    setClsLayersActive("btn_title_props");
    setClsHistorysActive("btn_title_props");
  };
  const layersSelect = () => {
    setPropActive(false);
    setLayersActive(true);
    setHistorysActive(false);
    setClsPropActive("btn_title_props");
    setClsLayersActive("btn_title_props-active");
    setClsHistorysActive("btn_title_props");
  };
  const historySelect = () => {
    setPropActive(false);
    setLayersActive(false);
    setHistorysActive(true);
    setClsPropActive("btn_title_props");
    setClsLayersActive("btn_title_props");
    setClsHistorysActive("btn_title_props-active");
  };

  if (!flagFonts) {
    return (
      <div className={clsContainer}>
        <ul>
          <li className="add_obj-title">
            <span className={clsPropActive} onClick={propsSelect}>
              Свойства
            </span>
            <span className={clsLayersActive} onClick={layersSelect}>
              Слои
            </span>
            <span className={clsHistoryActive} onClick={historySelect}>
              История
            </span>
          </li>
        </ul>
        {propActive ? <PropertiesObj inputPropRef={inputPropRef} setFlagFonts={setFlagFonts} /> : <></>}
        {layersActive ? <LayersObj /> : <></>}
        {historyActive ? <HistoryObj /> : <></>}
      </div>
    );
  } else {
    return <FontsContainer setFlagFonts={setFlagFonts} />;
  }
});
