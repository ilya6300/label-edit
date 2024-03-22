import React from "react";
import Object from "../store/Object";
import objVisible from "../img/icons/icon_visible.png";
import objHidden from "../img/icons/icon_hidden.png";
import { observer } from "mobx-react-lite";

export const LayersObj = observer(({ setPropActive }) => {
  const getPropsObj = (e) => {
    console.log(e.target.id);
    Object.getObject(e);
    let reg = Object.obj.target.id.replace(/\D/gm, "");
    Object.objects.find((el) => {
      if (el.id === Number(reg)) {
        Object.setPropObj(el);
      }
    });
  };
  // Активировать или деактивировать объект
  const activeObjFunc = (e) => {
    getPropsObj(e);
    if (Object.prop_obj.active) {
      Object.activeObj(false);
    } else {
      Object.activeObj(true);
    }
  };
  const getNameLayers = (e) => {
    getPropsObj(e);
    Object.boxShadowObj();
    Object.zIndexObj();
  };

  return (
    <ul className="list_props">
      <li className="add_obj-title">
        <span className="btn_title_props" onClick={() => setPropActive(true)}>
          Свойства
        </span>{" "}
        <span className="btn_title_props-active">Слои</span>
      </li>
      {Object.objects.map((obj) =>
        obj.id !== 9999 ? (
          <li
            className="prop_obj flx_align"
            onClick={getNameLayers}
            key={obj.id}
            id={obj.id}
          >
            <span id={obj.id} className="prop_layers_text">
              {obj.name}
            </span>{" "}
            <img
              id={obj.id}
              onClick={activeObjFunc}
              className="prop_layers_img"
              src={obj.active ? objVisible : objHidden}
              alt=""
            />
          </li>
        ) : (
          <></>
        )
      )}
    </ul>
  );
});
