import React from "react";
import service from "../../request/service";
import Object from "../../store/Object";
import Memory from "../../store/Memory";

export const DMContainer = ({ setDmFlag }) => {
  const dm_collection = [
    {
      id: 1,
      name: "Молочная продукция",
      length: 42,
      dm: "0104603721020607215>(egerf3ukLfdK5r93zoJf",
    },
    {
      id: 2,
      name: "Упакованная вода",
      length: 38,
      dm: "0104603721020607215>(egukLfdK5r93zoJf",
    },
    {
      id: 3,
      name: "Бады длинный код",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 4,
      name: "Бады укороченный код",
      length: 38,
      dm: "0104603721020607215>(egukLfdK5r93zoJf",
    },
    {
      id: 5,
      name: "Обувь",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 6,
      name: "Табак",
      length: 29,
      dm: "0104603721020607215>5r93zoJf",
    },
    {
      id: 7,
      name: "Духи и туалетная вода",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 8,
      name: "Шины и покрышки",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 9,
      name: "Фармацевтическая продукция",
      length: 31,
      dm: "0104603721020607215>(K5r93zoJf",
    },
    {
      id: 10,
      name: "Велосипеды",
      length: 31,
      dm: "0104603721020607215>(K5r93zoJf",
    },
    {
      id: 11,
      name: "Кресла-коляски",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 12,
      name: "Альтернативная табачная продукция",
      length: 29,
      dm: "0104603721020607215>5r93zoJf",
    },
    {
      id: 13,
      name: "Пиво",
      length: 43,
      dm: "0104603721020607215>(egerf3ukLfdbK5r93zoJf",
    },
    {
      id: 14,
      name: "Никотинсодержащая продукция",
      length: 29,
      dm: "0104603721020607215>5r93zoJf",
    },
    {
      id: 15,
      name: "Антисептик длинный код",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 16,
      name: "Антисептик укороченный код",
      length: 38,
      dm: "0104603721020607215>(egukLfdK5r93zoJf",
    },
    {
      id: 17,
      name: "Икра осетровых и лососевых рыб длинный код",
      length: 78,
      dm: "0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 18,
      name: "Икра осетровых и лососевых рыб укороченный код",
      length: 31,
      dm: "0104603721020607215>(egukLfdK5r93zoJf",
    },
    {
      id: 19,
      name: "Слабоалкогольные напитки",
      length: 32,
      dm: "0104603721020607215>(K5fr93zoJf",
    },
    {
      id: 20,
      name: "Безалкогольные напитки",
      length: 38,
      dm: "0104603721020607215>(egukLfdK5r93zoJf",
    },
    {
      id: 21,
      name: "Растительное масло",
      length: 38,
      dm: "0104603721020607215>(e5r93zoJf",
    },
    {
      id: 22,
      name: "Косметика и бытовая химия длинный код",
      length: 78,
      dm: "0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 23,
      name: "Косметика и бытовая химия укороченный код",
      length: 31,
      dm: "0104603721020607215>(egr93zoJf",
    },
    {
      id: 24,
      name: "Консервы из овощей и фруктов длинный код",
      length: 78,
      dm: "0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 25,
      name: "Консервы из овощей и фруктов укороченный код",
      length: 31,
      dm: "0104603721020607215>fdKr93zoJf",
    },
    {
      id: 26,
      name: "Корма для животных длинный код",
      length: 78,
      dm: "0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 27,
      name: "Корма для животных укороченный код",
      length: 31,
      dm: "0104603721020607215>(e7L93zoJf",
    },
    {
      id: 28,
      name: "Ветеринарные препараты",
      length: 85,
      dm: "0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
    {
      id: 29,
      name: "Игрушки",
      length: 78,
      dm: "0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf",
    },
  ];

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
      pxX: 0,
      pxY: 0,
      pxW: 6,
      pxH: 6,
      x: 0,
      y: 0,
      body: dm.dm,
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
    <div className="add_obj_img ">
      <ul className="editor_list_obj_container border_none">
        <li className="add_obj-title">
          Выберите ДМ{" "}
          <span
            className="container_closed_btn"
            onClick={() => setDmFlag(false)}
          ></span>
        </li>
        {dm_collection.map((dm) => (
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
