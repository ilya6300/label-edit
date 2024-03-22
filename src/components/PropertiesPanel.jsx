import React, { useState } from "react";
import { PropertiesObj } from "./PropertiesObj";
import { LayersObj } from "./LayersObj";
import { observer } from "mobx-react-lite";
import { FontsContainer } from "./obj/FontsContainer";

export const PropertiesPanel = observer(({ clsContainer }) => {
  const [propActive, setPropActive] = useState(true);
  const [flagFonts, setFlagFonts] = useState(false);

  if (!flagFonts) {
    return (
      <div className={clsContainer}>
        {propActive ? (
          <PropertiesObj setPropActive={setPropActive} setFlagFonts={setFlagFonts}/>
        ) : (
          <LayersObj setPropActive={setPropActive} />
        )}
      </div>
    );
  } else {
    return <FontsContainer setFlagFonts={setFlagFonts} />;
  }
});
