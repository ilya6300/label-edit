import React from "react";
import { ListTemplate } from "./ListTemplate";
import { observer } from "mobx-react-lite";
import { ThisLabel } from "../ThisLabel";
import service from "../../request/service";
import Memory from "../../store/Memory";
import Templates from "../../store/Templates";
import Object from "../../store/Object";
import { Loader } from "../Loader";
import { BtnRed } from "../../UI/btn/BtnRed";
import { BtnVer1 } from "../../UI/btn/BtnVer1";
import { ImportTemplateBD } from "./ImportTemplateBD";

export const GetTemplate = observer(({ setVisibleTemplates }) => {
  // Выбор шаблона

  const selectedTemplate = (e) => {
    try {
      service.getTemplatesID(e.id);
    } catch (e) {
      console.error(e);
    }
  };

  const removeTemplate = () => {
    service.deleteTemplate();
  };

    const selectTemplateOpenThis = () => {
    selectTemplate();
    Templates.setNewTemplate(false);
  };
  const selectTemplateOpenClone = () => {
    selectTemplate();
    Templates.setNewTemplate(true);
  };
  const selectTemplate = () => {
    setVisibleTemplates(false);
    Templates.saveID(Templates.preview_templates.id);
    Object.select();
    Templates.downloadedTemplates(Object.objects_preview);
    setTimeout(() => {
      Object.editBodyPreview();
    }, 1000);
  };

  return (
    <div className="templates_preiew_container">
      <div className="templates_preiew_list templates_preiew_container_block-left">
        <ListTemplate selectedTemplate={selectedTemplate} />
      </div>

      {Object.objects_preview.length ? (
        <div className="templates_preiew_preview templates_preiew_container_block-right">
          {!service.templatesLoading ? (
            <>
              <ThisLabel
                objects={Object.objects_preview}
                preview={true}
                add_canvas="t"
              />
              <div className="templates_preiew_container_block-right-btn_container">
                <BtnVer1 onClick={selectTemplateOpenThis}>
                  Выбрать шаблон
                </BtnVer1>
                <BtnVer1 onClick={selectTemplateOpenClone}>Копировать</BtnVer1>
                <ImportTemplateBD />
                <BtnRed
                  style={{ position: "relative", top: 0, right: 0 }}
                  text="Удалить"
                  onClick={removeTemplate}
                />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <div className="templates_preiew_preview templates_preiew_container_block-right templates_preiew_container_block-right_text">
          {Memory.templates.length > 0 ? (
            <p>
              Выберите шаблон из списка слева, для предпросмотра. Ваш текуший
              шаблон не перезапишется, пока не нажмёте кнопку "Выбрать шаблон"
            </p>
          ) : (
            <p>
              В базе данных шаблоны отсутствуют. Создайте Ваш первый шаблон,
              сохраните и он отобразиться всписке.
            </p>
          )}
        </div>
      )}
    </div>
  );
});
