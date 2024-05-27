import React, { useEffect } from "react";
import service from "../../request/service";
import Memory from "../../store/Memory";
import { ItemTemplate } from "./ItemTemplate";
import { observer } from "mobx-react-lite";
import { Loader } from "../Loader";

export const ListTemplate = observer(({ selectedTemplate }) => {
  useEffect(() => {
    service.getTemplates();
  }, []);
  if (service.templatesListLoading || service.imgLoading) {
    return <Loader />;
  }
  if (Memory.templates.length !== 0) {
    return Memory.templates.map((template) => (
      <ItemTemplate
        selectedTemplate={selectedTemplate}
        key={template.id}
        template={template}
      />
    ));
  } else {
    return <Loader />;
  }
});
