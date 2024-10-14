import React from "react";
import * as FileSaver from "file-saver";
import { BtnVer1 } from "../../UI/btn/BtnVer1";
import service from "../../request/service";
import Templates from "../../store/Templates";

export const ImportTemplateBD = () => {
  const exportTemplate = async () => {
    // const templateBody = body;
    const templateName = Templates.preview_templates.name;
    const fileExtension = ".tdmc";
    const data = new Blob(
      [await service.exportCodeTemplate(Templates.preview_templates.id)],
      {
        type: "text/plain;charset=utf-8",
      }
    );
    FileSaver.saveAs(data, templateName + fileExtension);
  };

  return (
    <>
      <BtnVer1 onClick={exportTemplate}>Экспортировать</BtnVer1>
    </>
  );
};
