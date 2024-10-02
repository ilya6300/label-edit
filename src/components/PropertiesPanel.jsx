import React, { useState } from "react";
import { PropertiesObj } from "./PropertiesObj";
import { LayersObj } from "./LayersObj";
import { observer } from "mobx-react-lite";
import { FontsContainer } from "./obj/FontsContainer";
import { HistoryObj } from "./history/HistoryObj";
import { VarText } from "./obj/vartext/VarText";

export const PropertiesPanel = observer(({ clsContainer }) => {
  const [propActive, setPropActive] = useState(true);
  const [layersActive, setLayersActive] = useState(false);
  const [historyActive, setHistorysActive] = useState(false);
  // Классы кнопок
  const [clsPropActive, setClsPropActive] = useState("btn_title_props-active");
  const [clsLayersActive, setClsLayersActive] = useState("btn_title_props");
  const [clsHistoryActive, setClsHistorysActive] = useState("btn_title_props");
  //
  const [flagFonts, setFlagFonts] = useState(false);
  const [varText, setVarText] = useState(false);

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

  if (!varText && !flagFonts) {
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
        {propActive ? (
          <PropertiesObj setVarText={setVarText} setFlagFonts={setFlagFonts} />
        ) : (
          <></>
        )}
        {layersActive ? <LayersObj /> : <></>}
        {historyActive ? <HistoryObj /> : <></>}
      </div>
    );
  }
  if (flagFonts) {
    return <FontsContainer setFlagFonts={setFlagFonts} />;
  }
  if (varText) {
    return <VarText setVarText={setVarText} />;
  }
});
