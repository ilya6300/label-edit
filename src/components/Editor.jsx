import React, { useEffect, useState } from "react";
import { Label } from "./Label";
import { toJS } from "mobx";
import Object from "../store/Object";
import { AddContainer } from "./AddContainer";
import { observer } from "mobx-react-lite";
import { BarLabel } from "./BarLabel";
import { BtnControl } from "../control/BtnControl";
import service from "../request/service";
import { GetTemplate } from "./templates/GetTemplate";
import Templates from "../store/Templates";
import { StartAddFonts } from "./fonts/StartAddFonts";
import { Loader } from "./Loader";
import { ServerError } from "./ServerError";
import { BrowserNotSupported } from "./messages/BrowserNotSupported";
import { ExchangeWithServer } from "./messages/ExchangeWithServer";
import Memory from "../store/Memory";
import { ImportCompanent } from "./import/ImportCompanent";
import { MessagesContainer } from "./messages/MessagesContainer";
import { PrinterSettings } from "./PrinterSettings";
import { ContainerPostDownloader } from "./messages/ContainerPostDownloader";

export const Editor = observer(() => {
  const [browserNotSupportedFlag, setBrowserNotSupportedFlag] = useState(false);

  useEffect(() => {
    service.getFonts();
  }, []);

  useEffect(() => {
    setNoFonts(false);
  }, [!service.fontsLoading]);

  // Класс мм сетки
  const [clsMM, setClsMM] = useState("");
  const [printerSetting, setPrinterSetting] = useState(false);
  const [noFonts, setNoFonts] = useState(false);
  const [importC, setImportC] = useState(false);
  const [visibleTemplates, setVisibleTemplates] = useState(false);
  const [flagPreview, setFlagPrevier] = useState(false);
  if (!browserNotSupportedFlag) {
    return (
      <div className="editor_container">
        <MessagesContainer />
        {Memory.exchange ? <ExchangeWithServer /> : <></>}
        <BtnControl />
        {!service.fontsLoading && !service.errorNetwork ? (
          <>
            {!noFonts ? (
              <>
                <BarLabel
                  setVisibleTemplates={setVisibleTemplates}
                  visibleTemplates={visibleTemplates}
                  setFlagPrevier={setFlagPrevier}
                  flagPreview={flagPreview}
                  clsMM={clsMM}
                  setClsMM={setClsMM}
                  setImportC={setImportC}
                  setPrinterSetting={setPrinterSetting}
                  printerSetting={printerSetting}
                />
                {visibleTemplates ? (
                  <GetTemplate setVisibleTemplates={setVisibleTemplates} />
                ) : (
                  <div className="editor_list_viewer">
                    {importC ? (
                      <ImportCompanent setImportC={setImportC} />
                    ) : (
                      <></>
                    )}
                    {!service.fontsLoading ? <AddContainer /> : <></>}
                    {Memory.post_download_flag ? (
                      <ContainerPostDownloader />
                    ) : (
                      <></>
                    )}
                    <Label
                      flagPreview={flagPreview}
                      setFlagPrevier={setFlagPrevier}
                      clsMM={clsMM}
                    />
                    {printerSetting ? (
                      <PrinterSettings setPrinterSetting={setPrinterSetting} />
                    ) : (
                      <></>
                    )}
                  </div>
                )}
                {/* <button
                  style={{ width: "50px" }}
                  onClick={() =>
                    console.log(
                      "objects",
                      toJS(Object.objects),
                      "obj",
                      toJS(Object.obj),
                      "downloaded_template",
                      toJS(Templates.downloaded_template),
                      "Object.download_objects",
                      toJS(Object.download_objects),
                      "this.preview_templates",
                      toJS(Templates.preview_templates)
                            )
                  }
                >
                  Check model
                </button> */}
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
