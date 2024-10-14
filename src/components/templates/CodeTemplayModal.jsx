import React, { useEffect, useRef, useState } from "react";
import Templates from "../../store/Templates";
import { observer } from "mobx-react-lite";

export const CodeTemplayModal = observer(({ setVisibleCodeTemplateFlag }) => {
  const [actionContainer, setActionContainer] = useState("Развернуть");
  const [classBodyCode, setClassBodyCode] = useState(
    "modal_template_body_visible_start"
  );
  const refBodyTemplate = useRef();
  useEffect(() => {
    refBodyTemplate.current.innerHTML = Templates.code_type_template.replace(
      /\n/g,
      `<br>`
    );
  }, [Templates.code_type_template]);

  const visibleBody = () => {
    if (
      classBodyCode !== "modal_template_body_hidden" ||
      classBodyCode === "modal_template_body_visible_start"
    ) {
      setActionContainer("Свернуть");
      setClassBodyCode("modal_template_body_hidden");
      setTimeout(() => {
        refBodyTemplate.current.innerHTML =
          Templates.code_type_template.replace(/\n/g, `<br>`);
      }, 300);
    } else {
      refBodyTemplate.current.innerHTML = "";
      setActionContainer("Развернуть");
      setClassBodyCode("modal_template_body_visible");
    }
  };

  return (
    <div className="modal_template_container">
      <div className="modal_template_title_container">
        <span>
          Шаблон на языке{" "}
          {JSON.parse(localStorage.getItem("printer")).type_printer}
        </span>
        <div className="modal_template_btn_container">
          <span className="modal_template_btn" onClick={visibleBody}>
            {actionContainer}
          </span>
          <span
            className="modal_template_btn"
            onClick={() => setVisibleCodeTemplateFlag(false)}
          >
            Закрыть
          </span>
        </div>
      </div>
      <div ref={refBodyTemplate} className={classBodyCode}>
        {Templates.code_type_template}
      </div>
    </div>
  );
});
