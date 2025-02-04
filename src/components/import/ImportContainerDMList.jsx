import React from "react";
import Theme from "../../store/Theme";
import DMcollection from "../../store/DMcollection";
import service from "../../request/service";
import Memory from "../../store/Memory";
import Object from "../../store/Object";

export const ImportContainerDMList = ({ setSelectedDM }) => {
  const selectedTypeDM = async (dm) => {
    console.log(dm);
    if (service.dm_table.length === 0) {
      await service.getSizeDM();
    }
    let i = 0;
    let flag = false;
    while (!flag) {
      if (service.dm_table[i].max_data_alpha_num < dm.length) {
        i++;
      } else {
        Object.setMinSizeDM(service.dm_table[i].row_sym_size / Memory.dpi);
        flag = true;
        setSelectedDM(false);
      }
    }
  };

  return (
    <ul
      className="import_container_dm_list"
      style={{
        background: Theme.background,
      }}
    >
      <li
        className="import_container-title"
        style={{
          background: Theme.background,
        }}
      >
        Выберите тип импортированного ДМ, для его корректного отображения.
      </li>
      {DMcollection.dm_collection.map((dm) => (
        <li
          dm={dm}
          onClick={() => selectedTypeDM(dm)}
          key={dm.id}
          className="add_obj import_container_li"
        >
          {dm.name}
        </li>
      ))}
    </ul>
  );
};
