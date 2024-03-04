import React from "react";
import { Label } from "./Label";
import { toJS } from "mobx";
import Object from "../store/Object";
import { AddContainer } from "./AddContainer";
import { observer } from "mobx-react-lite";
import { Barcode } from "./barcode/Barcode";
import { BarLabel } from "./BarLabel";

export const Editor = observer(() => {
  return (
    <div className="editor_container">
        <BarLabel />
      <div className="editor_list_viewer">
        <AddContainer />
        <Label />
      </div>
      <button onClick={() => console.log(toJS(Object.objects))}>
        Check model
      </button>
    </div>
  );
});
