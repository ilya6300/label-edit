import React from "react";
import service from "../../request/service";
import { ItemImg } from "./ItemImg";
import { observer } from "mobx-react-lite";

export const ListImg = observer(({getThisImg}) => {
  return (
    <div className="img_container">
      {service.images.length ? (
        service.images.map((img) => <ItemImg key={img.name} img={img} getThisImg={getThisImg}/>)
      ) : (
        <p className="prop_obj_none">Добавьте первое изображение</p>
      )}
    </div>
  );
});
