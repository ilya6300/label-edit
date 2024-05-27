import React from "react";
import { BtnVer1 } from "../UI/btn/BtnVer1";
import Memory from "../store/Memory";
import Object from "../store/Object";
import service from "../request/service";
import Templates from "../store/Templates";
import { observer } from "mobx-react-lite";

export const PostCompanent = observer(({ valueName, setValueName }) => {
  // const [visibleName, setVisibleName] = useState(Memory.visible_modal_post);

  // Сохранить текущий шаблон

  // Извлечение новых элементов
  const extractionObj = (array) => {
    const post_objects = [];
    array.forEach((el) => {
      const obj = {
        name: el.name,
        enabled: el.active,
        pos_x: Math.round(el.x * 100) / 100,
        pos_y: Math.round(el.y * 100) / 100,
        rotation: Number(el.style.rotate),
      };
      if (el.typeObj !== "img") {
        obj.data = el.body;
      }
      if (el.typeObj === "text") {
        obj.type = "text";
      } else {
        obj.width = Math.round(el.w * 100) / 100;
        obj.height = Math.round(el.h * 100) / 100;
      }
      if (el.typeObj === "text" || el.typeObj === "block") {
        obj.font_size = el.style.fontSize;
        obj.font_id = el.font_family_id;
      }
      if (el.typeObj === "block") {
        obj.type = "block";
        obj.text_align = el.style.position;
      }
      // barcode
      if (el.typeObj === "barcode") {
        obj.type = "barcode";
        if (el.typeBarcode === "datamatrix") {
          obj.code_type = "datamatrix";
        }
        if (el.typeBarcode === "ean13") {
          obj.code_type = "ean13";
        }
        if (el.typeBarcode === "code128") {
          obj.code_type = "code128";
        }
        if (el.typeBarcode === "qrcode") {
          obj.code_type = "qrcode";
        }
      }
      if (el.typeObj === "img") {
        obj.image_id = el.image_id;
        obj.type = "img";
      }
      post_objects.push(obj);
    });
    return post_objects;
  };

  // Добавление объектов при создании нового шаблона
  const postTemplates = () => {
    if (valueName.length < 3) {
      return alert("Имя шаблона должно содержать минимум 3 символа");
    }
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
  };
  // Изменить шаблон
  // Обновление объектов
  const updateObj = () => {
    // Временный массив который хранит в себе элементы которые были обновлены
    const update_object = [];
    // console.log(toJS(Templates.downloaded_template));
    // console.log(toJS(Object.objects));
    // Перебираем ранее загруженный массив, с тем что на этикетке
    Templates.downloaded_template.forEach((old) => {
      Object.objects.filter((newT) => {
        // Ищем объекты, и проверяем что они не равны
        if (
          old.id === newT.id &&
          JSON.stringify(old) !== JSON.stringify(newT)
        ) {
          // перебираем все элементы у объекта, в котором были произведены изменения
          const temp = { field_id: old.id };
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
                temp.width = newT.w;
                temp.height = newT.h;
              }
              // Изменение тела
              if (key === "body") {
                temp.data = newT.body;
              }
              // ИВ шрифта
              if (key === "font_family_id") {
                temp.font_id = newT.font_family_id;
              }
            }
          }
          for (let key in old.style) {
            if (old.style[key] !== newT.style[key]) {
              // изменение стиля - поворот, шрифты, позиция текста
              if (key === "rotate") {
                temp.rotation = newT.style.rotate;
              }
              if (key === "fontSize") {
                temp.rotation = newT.style.fontSize;
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
    if (update_object.length !== 0) {
      console.log(update_object);
      service.pathUpdateObj(update_object);
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
    // if (Templates.preview_templates.name !== valueName) {
    //   update_label["name"] = valueName;
    // }

    if (JSON.stringify(update_label) !== "{}") {
      console.log(update_label);
      service.pathUpdateLabel(update_label);
    }
  };
  // удалить объект с этикетки, который был загружен ранее
  const deleteObject = () => {
    const delete_objects = [];
    Templates.downloaded_template.forEach((d) => {
      if (!JSON.stringify(Object.objects).includes(JSON.stringify(d))) {
        delete_objects.push(d.id);
      }
    });
    if (delete_objects.length !== 0) {
      service.deleteObj(delete_objects);
    }
    // console.log(delete_objects)
  };
  // Добавить новый элемент на существующею этикетку
  const newObjPost = () => {
    const new_objects = [];
    Object.objects.forEach((newObj) => {
      if (
        !JSON.stringify(Templates.downloaded_template).includes(
          JSON.stringify(newObj)
        )
      ) {
        new_objects.push(newObj);
      }
    });
    if (new_objects.length > 0) {
      console.log(extractionObj(new_objects));
      service.addNewObj(extractionObj(new_objects));
    }
  };
  // Изменить существующею этикетку
  const pathTemplates = () => {
    updateObj();
    updateLabel();
    deleteObject();
    newObjPost();
  };

  return (
    <>
      <BtnVer1
        onClick={() =>
          Memory.visible_modal_post ? Memory.visiblePost(false) : Memory.visiblePost(true)
        }
      >
        {JSON.stringify(Templates.preview_templates) === "{}"
          ? "Сохранить новый"
          : "Сохранить " + valueName}
      </BtnVer1>{" "}
      {Memory.visible_modal_post ? (
        <div className="post_template_container_modal">
          {JSON.stringify(Templates.preview_templates) === "{}" ? (
            <>
              {" "}
              <p className="post_template_modal_text">
                Введите название шаблона
              </p>
              <input
                type="text"
                value={valueName}
                onChange={(e) => setValueName(e.target.value)}
              />
              <BtnVer1 onClick={postTemplates}>Сохранить</BtnVer1>
              <BtnVer1 onClick={() => Memory.visiblePost(false)}>Закрыть</BtnVer1>
            </>
          ) : (
            <>
              {" "}
              <p className="post_template_modal_text">
                Шаблон: {Memory.name_template}
              </p>
              <BtnVer1 onClick={pathTemplates}>Изменить</BtnVer1>
              <BtnVer1 onClick={() => Memory.visiblePost(false)}>Закрыть</BtnVer1>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
