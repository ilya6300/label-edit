import React, { useEffect, useRef, useState } from "react";
import { BtnVer1 } from "../UI/btn/BtnVer1";
import Memory from "../store/Memory";
import Object from "../store/Object";
import service from "../request/service";
import Templates from "../store/Templates";
import { observer } from "mobx-react-lite";
import Msg from "../store/Msg";
import { toJS } from "mobx";
import Theme from "../store/Theme";

export const PostCompanent = observer(({ valueName, setValueName }) => {
  // Извлечение новых элементов
  const extractionObj = (array) => {
    const post_objects = [];
    array.forEach((el) => {
      const obj = {
        name: el.typeBarcode !== "datamatrix" ? el.name : el.fakeBody,
        enabled: el.active,
        pos_x: Math.round(el.x * 100) / 100,
        pos_y: Math.round(el.y * 100) / 100,
        rotation: Number(el.style.rotate),
      };
      if (el.typeObj !== "img") {
        obj.data = el.body;
      }
      if (el.typeBarcode !== "datamatrix" && el.typeObj === "lines") {
        obj.width = Math.round(el.w * 100) / 100;
        obj.height = Math.round(el.h * 100) / 100;
      }
      if (el.typeObj === "text" || el.typeObj === "block") {
        obj.font_id = el.font_family_id;
        obj.font_size = el.style.fontSize;
      }
      if (el.typeObj === "block") {
        obj.text_align = Number(el.style.position);
      }
      // barcode
      if (el.typeObj === "barcode") {
        obj.human_readable = el.human_readable;
        if (el.typeBarcode === "datamatrix") {
          obj.code_type = "datamatrix";
          obj.width = el.w;
          obj.height = el.size;
          obj.radius = el.min_size;
        }
        if (el.typeBarcode === "ean13") {
          obj.code_type = "ean13";
          obj.radius = el.pxW;
          obj.font_size = el.pxH;
        }
        if (el.typeBarcode === "code128") {
          obj.code_type = "code128";
          obj.radius = el.pxW;
          obj.font_size = el.pxH;
        }
        if (el.typeBarcode === "qrcode") {
          obj.code_type = "qrcode";
        }
      }
      if (el.typeObj === "img") {
        obj.image_id = el.image_id;
      }
      if (el.typeObj === "box") {
        obj.line_thickness = el.line_thickness;
        obj.radius = el.borderRadius;
      }
      if (el.typeObj === "lines") {
        if (
          String(el.style.rotate) === "0" ||
          String(el.style.rotate) === "180"
        ) {
          obj.width = Math.round((Number(el.x) + Number(el.w)) * 100) / 100;
          obj.height = Math.round(Number(el.y) * 100) / 100;
          obj.line_thickness = Math.round(Number(el.h) * 100) / 100;
        } else {
          obj.width = Math.round(Number(el.x) * 100) / 100;
          obj.height = Math.round((Number(el.y) + Number(el.h)) * 100) / 100;
          obj.line_thickness = Math.round(Number(el.w) * 100) / 100;
        }
      } else {
        obj.width = Math.round(Number(el.w) * 100) / 100;
        obj.height = Math.round(Number(el.h) * 100) / 100;
      }
      obj.type = el.typeObj;
      post_objects.push(obj);
    });
    return post_objects;
  };

  const calculationAutoHeight = () => {
    const block = document.querySelectorAll(".bardcode_container-block");
    block.forEach((obj) => {
      const ID = Object.objects.find((i) => i.id === Number(obj.id));
      obj.style.height = "auto";
      obj.style.width = "auto";
      if (ID) {
        setTimeout(() => {
          ID.pxH = obj.offsetHeight / Memory.mm;
          ID.h = obj.offsetHeight / Memory.mm;
          ID.pxW = obj.offsetWidth / Memory.mm;
          ID.w = obj.offsetWidth / Memory.mm;
        }, 50);
      }
    });
  };

  // Добавление объектов при создании нового шаблона
  const postTemplates = () => {
    try {
      calculationAutoHeight();
    } catch (e) {
      console.error(e);
    }
    if (valueName.length < 3) {
      return alert("Имя шаблона должно содержать минимум 3 символа");
    }
    try {
      const template = {
        name: valueName,
        width_mm: Number(Memory.width_label),
        height_mm: Number(Memory.height_label),
        gap_mm: Number(Memory.gap),
        reference_x: Number(Memory.ref_x),
        reference_y: Number(Memory.ref_y),
        direction_x: Number(Memory.DIRECTION_1),
        direction_y: Number(Memory.DIRECTION_2),
        objects: [],
      };
      template.objects = [...extractionObj(Object.objects)];
      service.postTemplate(template);
      Memory.visiblePost(false);
      Object.resetPreiew();
      Templates.setNewTemplate(false);
    } catch (e) {
      console.error(e);
    }
  };
  // Изменить шаблон
  // Обновление объектов
  const updateObj = async () => {
    try {
      calculationAutoHeight();
    } catch (e) {
      console.error(e);
    } finally {
      // Временный массив который хранит в себе элементы которые были обновлены
      const update_object = [];

      setTimeout(async () => {
        if (Object.download_objects === null) {
          return;
        }
        Object.download_objects.forEach((old) => {
          Object.objects.filter((newT) => {
            // Ищем объекты, и проверяем что они не равны
            if (
              old.id === newT.id &&
              JSON.stringify(old) !== JSON.stringify(newT)
            ) {
              // перебираем все элементы у объекта, в котором были произведены изменения
              const temp = { field_id: Number(old.id) };
              for (let key in old) {
                // Сравниваем изменённые поля
                if (old[key] !== newT[key]) {
                  // изменение координа
                  if (key === "x" || key === "y") {
                    temp.pos_x = newT.x;
                    temp.pos_y = newT.y;
                  }
                  // изменение имени объекта
                  if (key === "name") {
                    temp.name = newT.name;
                  }
                  // Отключение / включение active
                  if (key === "active") {
                    temp.enabled = newT.active;
                  }
                  // Ширина / высота
                  if (key === "w" || key === "h") {
                    if (old.typeObj !== "lines") {
                      temp.width = Math.round(newT.w * 100) / 100;
                      temp.height = Math.round(newT.h * 100) / 100;
                    } else {
                      if (
                        String(newT.style.rotate) === "0" ||
                        String(newT.style.rotate) === "180"
                      ) {
                        temp.width =
                          Math.round((Number(newT.x) + Number(newT.w)) * 100) /
                          100;
                        temp.height = Math.round(Number(newT.y) * 100) / 100;
                        temp.line_thickness =
                          Math.round(Number(newT.h) * 100) / 100;
                      } else {
                        temp.width = Math.round(Number(newT.x) * 100) / 100;
                        temp.height =
                          Math.round((Number(newT.y) + Number(newT.h)) * 100) /
                          100;
                        temp.line_thickness =
                          Math.round(Number(newT.w) * 100) / 100;
                      }
                    }
                  }
                  // Изменение тела
                  if (key === "body") {
                    temp.data = newT.body;
                  }
                  // ИВ шрифта
                  if (key === "font_family_id") {
                    temp.font_id = newT.font_family_id;
                  }
                  // видимость текста шк
                  if (key === "human_readable") {
                    temp.human_readable = newT.human_readable;
                  }
                  // Ширина в пикселях для линейного шк. radius на бэке - pxW, font_size - pxH
                  if (
                    key === "pxW" &&
                    (old.typeBarcode === "ean13" ||
                      old.typeBarcode === "code128")
                  ) {
                    temp.radius = newT.pxW;
                    temp.font_size = newT.pxH;
                  }
                }
              }
              for (let key in old.style) {
                if (old.style[key] !== newT.style[key]) {
                  // изменение стиля - поворот, шрифты, позиция текста
                  if (key === "rotate") {
                    if (newT.typeBarcode === "datamatrix") {
                      temp.rotation = newT.min_size;
                    } else {
                      temp.rotation = newT.style.rotate;
                    }
                  }
                  if (key === "fontSize") {
                    temp.font_size = newT.style.fontSize;
                  }
                  if (key === "position") {
                    temp.text_align = newT.style.position;
                  }
                }
              }
              update_object.push(temp);
            }
          });
        });
        let res;
        if (update_object.length !== 0) {
          res = await service.pathUpdateObj(update_object);
        }
        return res;
      }, 300);
      // Перебираем ранее загруженный массив, с тем что на этикетке
    }
  };
  // Изменить параметры этикетки
  const updateLabel = () => {
    const update_label = {};
    const checkParameter = (oldP, newP) => {
      if (Templates.preview_templates[oldP] !== newP) {
        update_label[oldP] = Number(newP);
      }
    };
    checkParameter("width_mm", Memory.width_label);
    checkParameter("height_mm", Memory.height_label);
    checkParameter("gap_mm", Memory.gap);
    checkParameter("reference_x", Memory.ref_x);
    checkParameter("reference_y", Memory.ref_y);
    checkParameter("direction_x", Memory.DIRECTION_1);
    checkParameter("direction_y", Memory.DIRECTION_2);

    if (JSON.stringify(update_label) !== "{}") {
      service.pathUpdateLabel(update_label);
    }
  };
  // удалить объект с этикетки, который был загружен ранее
  const deleteObject = () => {
    const delete_objects = [];
    const id_old_id = [];
    const id_obj = [];
    Object.objects.forEach((o) => {
      id_obj.push(o.id);
    });
    Object.objects_preview.forEach((d) => {
      id_old_id.push(d.id);
    });
    id_old_id.forEach((id) => {
      if (!id_obj.includes(id)) {
        delete_objects.push(id);
      }
    });
    if (Object.objects.length === 0) {
      return Msg.writeMessages("Нельзя сохранить пустой шаблон!");
    }
    if (delete_objects.length !== 0) {
      service.deleteObj(delete_objects);
    }
  };
  // Добавить новый элемент на существующею этикетку
  const newObjPost = async () => {
    try {
      const new_objects = [];
      const id_old_object = [];
      Object.objects_preview.forEach((o) => {
        id_old_object.push(o.id);
      });
      Object.objects.forEach((newObj) => {
        if (!id_old_object.includes(newObj.id)) {
          new_objects.push(newObj);
        }
      });
      let res;
      if (new_objects.length > 0) {
        res = await service.addNewObj(extractionObj(new_objects));
      }

      return res;
    } catch (e) {
      console.error(e);
    }
  };
  // Изменить существующую этикетку
  const pathTemplates = async () => {
    try {
      Memory.setPostDownLoadFlag(true);
      // renameTemplate();
      newObjPost();
      updateObj();
      updateLabel();
      setTimeout(() => {
        deleteObject();
      }, 1000);
      setTimeout(async () => {
        Object.objects = [];
        await service.getTemplatesID(Templates.template_id);
        // setTimeout(() => {
        Object.select();
        // }, 1500);
      }, 2000);
      Memory.visiblePost(false);
    } catch (e) {
      console.error(e);
    }
  };

  const modalPostRef = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", closedPostModal);
  }, []);
  const closedPostModal = (e) => {
    if (modalPostRef.current && !modalPostRef.current.contains(e.target)) {
      Memory.visiblePost(false);
    }
  };
  // const [renameFlag, setRenameFlag] = useState(false);
  // const [rename, setRename] = useState(Memory.name_template);
  // const handlerRename = async (e) => {
  //   setRename(e.target.value);
  // };

  return (
    <>
      <BtnVer1
        onClick={() =>
          Memory.visible_modal_post
            ? Memory.visiblePost(false)
            : Memory.visiblePost(true)
        }
      >
        {Templates.new_template ? "Сохранить новый" : "Сохранить "}
      </BtnVer1>{" "}
      {Memory.visible_modal_post ? (
        <div
          ref={modalPostRef}
          className="post_template_container_modal"
          style={{ background: Theme.background }}
        >
          {Templates.new_template ? (
            <>
              {" "}
              <p className="post_template_modal_text">
                Введите название шаблона
              </p>
              <div className="post_template_container_modal_ui_container">
                <input
                  className="post_template_container_modal_inpt_name"
                  type="text"
                  value={valueName}
                  onChange={(e) => setValueName(e.target.value)}
                  placeholder="Введите имя шаблона"
                />
                <BtnVer1 onClick={postTemplates}>Сохранить</BtnVer1>
                <BtnVer1 onClick={() => Memory.visiblePost(false)}>
                  Закрыть
                </BtnVer1>
              </div>
            </>
          ) : (
            <>
              {/* {!renameFlag ? ( */}
              <p className="post_template_modal_text">
                Шаблон: {Memory.name_template}
              </p>
              {/* // ) : (
              //   <div className="post_template_modal_rename_container">
              //     <p>Новое название шаблона - {Memory.name_template}</p>
              //     <input
              //       placeholder="Введите новое название шаблона"
              //       className="barlabel_text"
              //       value={rename}
              //       onChange={handlerRename}
              //     />
              //   </div>
              // )} */}
              <div className="post_template_modal_btn_container">
                <BtnVer1 onClick={pathTemplates}>Изменить</BtnVer1>
                {/* <BtnVer1
                  onClick={() =>
                    renameFlag ? setRenameFlag(false) : setRenameFlag(true)
                  }
                >
                  Переименовать
                </BtnVer1> */}
                <BtnVer1 onClick={() => Memory.visiblePost(false)}>
                  Закрыть
                </BtnVer1>
              </div>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
