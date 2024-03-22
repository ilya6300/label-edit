import React, { useState } from "react";
import { Label } from "./Label";
import { toJS } from "mobx";
import Object from "../store/Object";
import { AddContainer } from "./AddContainer";
import { observer } from "mobx-react-lite";
import { BarLabel } from "./BarLabel";

export const Editor = observer(() => {
  const [flagPreview, setFlagPrevier] = useState(false)
  return (
    <div className="editor_container">
      <h1 className="title_editor">Редактор этикеток</h1>
      <BarLabel setFlagPrevier={setFlagPrevier} flagPreview={flagPreview}/>
      <div className="editor_list_viewer">
        <AddContainer />
        <Label flagPreview={flagPreview}/>
      </div>
      <button
        style={{ width: "50px" }}
        onClick={() => console.log("objects", toJS(Object.objects), 'obj', toJS(Object.obj))}
      >
        Check model
      </button>
    </div>
  );
});
