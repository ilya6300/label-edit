import React, { useState } from "react";
import { PropertiesObj } from "./PropertiesObj";
import { LayersObj } from "./LayersObj";
import { observer } from "mobx-react-lite";
import { FontsContainer } from "../features/fonts/FontsContainer";
import { HistoryObj } from "./history/HistoryObj";
import { VarText } from "./obj/vartext/VarText";
import Object from "../store/Object";
import { NoneProps } from "./NoneProps";
import Theme from "../store/Theme";

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
      <div className={clsContainer} style={{ border: Theme.theme_border }}>
        <ul>
          <li className="prop_obj-title" style={{ borderBottom: Theme.theme_border }}>
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
          <>
            {Object.obj !== null ? (
              <PropertiesObj
                setVarText={setVarText}
                setFlagFonts={setFlagFonts}
              />
            ) : (
              <NoneProps />
            )}
          </>
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
