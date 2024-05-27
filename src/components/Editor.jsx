import React, { useEffect, useRef, useState } from "react";
import { Label } from "./Label";
import { toJS } from "mobx";
import Object from "../store/Object";
import { AddContainer } from "./AddContainer";
import { observer } from "mobx-react-lite";
import { BarLabel } from "./BarLabel";
import { BtnControl } from "../control/BtnControl";
import service from "../request/service";
import { GetTemplate } from "./templates/GetTemplate";
import Fonts from "../store/Fonts";
import Templates from "../store/Templates";
import { StartAddFonts } from "./fonts/StartAddFonts";
import { Loader } from "./Loader";
import { ServerError } from "./ServerError";
import { BrowserNotSupported } from "./messages/BrowserNotSupported";
import { ExchangeWithServer } from "./messages/ExchangeWithServer";
import Memory from "../store/Memory";

export const Editor = observer(() => {
  const [browserNotSupportedFlag, setBrowserNotSupportedFlag] = useState(false);

  useEffect(() => {
    service.getFonts();
  }, []);

  const inputPropRef = useRef(null);

  useEffect(() => {
    if (window.navigator.userAgent.toLowerCase().match(/firefox/g)) {
      return setBrowserNotSupportedFlag(true);
      // return alert("Браузер Firefox не поддерживается, пожалуйста, используйте: GoogleChrom, YandexBrowser, Opera, Edge");
    }
    if (Fonts.fonts.length !== 0) {
      Fonts.fonts.forEach((f) => {
        const myFont = new FontFace(f.name, `url(${f.data})`);
        myFont.load();
        document.fonts.add(myFont);
      });
      setNoFonts(false);
      Fonts.defaultFont(Fonts.fonts[0]);
    } else {
      setNoFonts(true);
    }
  }, [!service.fontsLoading]);

  // Класс мм сетки
  const [clsMM, setClsMM] = useState("");

  const [noFonts, setNoFonts] = useState(false);

  const [visibleTemplates, setVisibleTemplates] = useState(false);
  const [flagPreview, setFlagPrevier] = useState(false);
  if (!browserNotSupportedFlag) {
    return (
      <div className="editor_container">
        {Memory.exchange ? <ExchangeWithServer /> : <></>}

        <BtnControl inputPropRef={inputPropRef}/>
        <h1 className="title_editor">Редактор этикеток</h1>

        {!service.fontsLoading && !service.errorNetwork ? (
          <>
            {!noFonts ? (
              <>
                {" "}
                <BarLabel
                  setVisibleTemplates={setVisibleTemplates}
                  visibleTemplates={visibleTemplates}
                  setFlagPrevier={setFlagPrevier}
                  flagPreview={flagPreview}
                  clsMM={clsMM}
                  setClsMM={setClsMM}
                />
                {visibleTemplates ? (
                  <GetTemplate />
                ) : (
                  <div className="editor_list_viewer">
                    <AddContainer />
                    <Label
                    inputPropRef={inputPropRef}
                      flagPreview={flagPreview}
                      setFlagPrevier={setFlagPrevier}
                      clsMM={clsMM}
                    />
                  </div>
                )}
                <button
                  style={{ width: "50px" }}
                  onClick={() =>
                    console.log(
                      "objects",
                      toJS(Object.objects),
                      "obj",
                      toJS(Object.obj),
                      "downloaded_template",
                      toJS(Templates.downloaded_template)
                    )
                  }
                >
                  Check model
                </button>
              </>
            ) : (
              <StartAddFonts />
            )}
          </>
        ) : !service.fontsLoading && service.errorNetwork ? (
          <ServerError />
        ) : (
          <Loader />
        )}
      </div>
    );
  }
  if (browserNotSupportedFlag) {
    return <BrowserNotSupported />;
  }
});
