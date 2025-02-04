import React from "react";
import service from "../../request/service";
import Object from "../../store/Object";
import Memory from "../../store/Memory";
import Theme from "../../store/Theme";
import DMcollection from "../../store/DMcollection";

export const DMContainer = ({ setDmFlag }) => {
  const addBarcode = (dm) => {
    let num = 1;
    while (num <= Object.objects.length) {
      num++;
    }
    Object.objects.forEach((obj) => {
      if (obj.id === num) {
        num++;
      }
    });
    const obj = {
      id: num,
      min_size: dm.size / Memory.dpi,
      human_readable: 0,
      human_readable_visible: false,
      name: "datamatrix",
      typeObj: "barcode",
      typeBarcode: "datamatrix",
      defaultBody: true,
      pxX: 0,
      pxY: 0,
      pxW: 6,
      pxH: 6,
      x: 0,
      y: 0,
      body: "{barcode}",
      fakeBody: dm.dm,
      zIndex: 2,
      w: 6,
      h: 6,
      size: dm.size,
      editSizeW: false,
      editSizeH: false,
      active: true,
      cls: ["bardcode_container-barcode"],
      clsPreview: "bardcode_container-barcode-preview",
      style: {
        fontSize: 12,
        position: "1",
        rotate: 0,
        boxShadow: "none",
      },
    };
    Object.addObj(obj);
    setDmFlag(false);
  };

  const selectedDM = async (dm) => {
    const dm_element = {
      dm: dm.dm,
      length: dm.length,
    };
    try {
      await service.getSizeDM();
    } catch (e) {
    } finally {
      let i = 0;
      let flag = false;
      while (!flag) {
        if (service.dm_table[i].max_data_alpha_num < dm_element.length) {
          i++;
        } else {
          dm_element.size = service.dm_table[i].row_sym_size;
          flag = true;
        }
      }
      addBarcode(dm_element);
    }
  };

  return (
    <div className="add_obj_img " style={{ background: Theme.background }}>
      <ul className="editor_list_obj_container border_none">
        <li
          className="add_obj-title"
          style={{
            borderBottom: Theme.theme_border,
            background: Theme.background,
          }}
        >
          Выберите ДМ
          <span
            className="container_closed_btn"
            onClick={() => setDmFlag(false)}
          ></span>
        </li>
        {DMcollection.dm_collection.map((dm) => (
          <li
            dm={dm}
            onClick={() => selectedDM(dm)}
            key={dm.id}
            className="add_obj"
          >
            {dm.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
