import React, { useEffect } from "react";
import { ListTemplate } from "./ListTemplate";
import { observer } from "mobx-react-lite";
import { ThisLabel } from "../ThisLabel";
import service from "../../request/service";
import Memory from "../../store/Memory";
import Templates from "../../store/Templates";
import Object from "../../store/Object";
import { Loader } from "../Loader";
import { toJS } from "mobx";
import Fonts from "../../store/Fonts";
import { BtnRed } from "../../UI/btn/BtnRed";
import Msg from "../../store/Msg";

export const GetTemplate = observer(() => {
  // Выбор шаблона

  const selectedTemplate = (e) => {
    service.getTemplatesID(e.id);
  };

  const removeTemplate = () => {
    service.deleteTemplate();
  };

  useEffect(() => {
    if (!service.templatesLoading) {
      convertTemplatesForLabel();
    }
  }, [!service.templatesLoading]);
  // Переобразовать в объект для отрисовки
  const convertTemplatesForLabel = async () => {
    console.log(toJS(Fonts.default_font));
    Object.resetPreiew();
    if (Templates.preview_templates.length === 0) {
      return Msg.writeMessages(
        "Этот шаблон не имеет объектов. Его выбрать невозможно. Выберите другой шаблон или создайте новый."
      );
    }
    if (JSON.stringify(Templates.preview_templates) === "{}") {
      return;
    }

    if (Templates.preview_templates.objects === undefined) return;
    console.log(toJS(Templates.preview_templates));
    Memory.widthLabelChange(Templates.preview_templates.width_mm);
    Memory.heigthLabelChange(Templates.preview_templates.height_mm);
    Memory.labelRefX(Templates.preview_templates.reference_x);
    Memory.labelRefY(Templates.preview_templates.reference_y);
    Memory.labelDirection1(Templates.preview_templates.direction_x);
    Memory.labelDirection2(Templates.preview_templates.direction_y);
    Memory.gapLabelChange(Templates.preview_templates.gap_mm);
    console.log(toJS(Templates.preview_templates));
    Templates.preview_templates.objects.forEach((el) => {
      if (el.type === "text") {
        const obj = {
          id: el.id,
          name: el.name,
          typeObj: "text",
          pxX: el.pos_x * Memory.mm,
          pxY: el.pos_y * Memory.mm,
          pxW: el.width,
          pxH: el.height,
          x: el.pos_x,
          y: el.pos_y,
          body: el.data,
          zIndex: 2,
          w: el.width,
          h: el.height,
          active: el.enabled,
          cls: ["bardcode_container-text "],
          clsPreview: "bardcode_container-text-preview",
          font_family_id:
            el.font_rel !== null ? el.font_id : Fonts.default_font.id,
          style: {
            fontSize: el.font_size,
            fontFamily:
              // el.font_rel !== null ? el.font_rel.name : Fonts.default_font.name,
              el.font_rel.name,
            rotate: el.rotation,
            boxShadow: "none",
          },
        };
        Object.addObjPreiew(obj);
      } else if (el.type === "block") {
        const obj = {
          id: el.id,
          name: el.name,
          typeObj: "block",
          pxX: el.pos_x * Memory.mm,
          pxY: el.pos_y * Memory.mm,
          pxW: el.width,
          pxH: el.height,
          x: el.pos_x,
          y: el.pos_y,
          body: el.data,
          zIndex: 2,
          w: el.width,
          h: el.height,
          editSizeW: false,
          editSizeH: false,
          active: el.enabled,
          cls: ["bardcode_container-block"],
          clsPreview: "bardcode_container-block-preview",
          font_family_id: el.font_id,
          style: {
            fontSize: el.font_size,
            fontFamily:
              el.font_rel !== null ? el.font_rel.name : Fonts.default_font.name,
            position: String(el.text_align),
            rotate: el.rotation,
            boxShadow: "none",
          },
        };
        Object.addObjPreiew(obj);
      } else if (el.type === "barcode") {
        if (el.code_type === "datamatrix") {
          const obj = {
            id: el.id,
            name: el.name,
            min_size: el.radius,
            size: el.height,
            typeObj: "barcode",
            typeBarcode: el.code_type,
            pxX: el.pos_x * Memory.mm,
            pxY: el.pos_y * Memory.mm,
            pxW: el.width,
            pxH: el.width,
            x: el.pos_x,
            y: el.pos_y,
            body: el.data,
            zIndex: 2,
            w: el.width,
            h: el.width,
            human_readable: el.human_readable,
            human_readable_visible: el.human_readable !== 0 ? true : false,
            editSizeW: false,
            editSizeH: false,
            active: el.enabled,
            cls: ["bardcode_container-barcode"],
            clsPreview: "bardcode_container-barcode-preview",
            style: {
              position: "left",
              rotate: el.rotation,
              boxShadow: "none",
            },
          };
          console.log("obj", obj);
          Object.addObjPreiew(obj);
        } else {
          const obj = {
            id: el.id,
            name: el.name,
            typeObj: "barcode",
            typeBarcode: el.code_type,
            pxX: el.pos_x * Memory.mm,
            pxY: el.pos_y * Memory.mm,
            pxW: el.width,
            pxH: el.height,
            x: el.pos_x,
            y: el.pos_y,
            body: el.data,
            zIndex: 2,
            w: el.width,
            h: el.height,
            human_readable: el.human_readable,
            human_readable_visible: el.human_readable !== 0 ? true : false,
            editSizeW: false,
            editSizeH: false,
            active: el.enabled,
            cls: ["bardcode_container-barcode"],
            clsPreview: "bardcode_container-barcode-preview",
            style: {
              position: "left",
              rotate: el.rotation,
              boxShadow: "none",
            },
          };
          console.log("obj2", obj);
          Object.addObjPreiew(obj);
        }
      } else if (el.type === "img") {
        const img_id_data = service.images.find(
          (img) => img.id === el.image_id
        );
        const obj = {
          id: el.id,
          name: el.name,
          typeObj: "img",
          pxX: el.pos_x * Memory.mm,
          pxY: el.pos_y * Memory.mm,
          pxW: el.width,
          pxH: el.height,
          x: el.pos_x,
          y: el.pos_y,
          body: img_id_data.data,
          zIndex: 2,
          w: el.width,
          h: el.height,
          editSizeW: false,
          editSizeH: false,
          active: el.enabled,
          image_id: el.image_id,
          cls: ["bardcode_container-barcode"],
          clsPreview: "bardcode_container-block-preview",
          style: {
            rotate: el.rotation,
            boxShadow: "none",
          },
        };

        Object.addObjPreiew(obj);
        // }
      } else if (el.type === "box") {
        const obj = {
          id: el.id,
          name: el.name,
          typeObj: "box",
          pxX: el.pos_x * Memory.mm,
          pxY: el.pos_y * Memory.mm,
          pxW: el.width,
          pxH: el.height,
          x: el.pos_x,
          y: el.pos_y,
          line_thickness: el.line_thickness,
          borderRadius: el.radius,
          zIndex: 2,
          w: el.width,
          h: el.height,
          editSizeW: false,
          editSizeH: false,
          active: el.enabled,
          cls: ["bardcode_container-barcode"],
          clsPreview: "bardcode_container-block-preview",
          style: {
            rotate: el.rotation,
            boxShadow: "none",
          },
        };
        Object.addObjPreiew(obj);
        // }
      } else if (el.type === "lines") {
        console.log("el.rotation", el.rotation === 0 || el.rotation === 180);
        const obj = {
          id: el.id,
          name: el.name,
          typeObj: "lines",
          pxX: el.pos_x * Memory.mm,
          pxY: el.pos_y * Memory.mm,
          pxW:
            el.rotation === 0 || el.rotation === 180
              ? el.width - el.pos_x
              : el.font_size,
          pxH:
            el.rotation === 0 || el.rotation === 180
              ? el.font_size
              : el.height - el.pos_y,
          x: el.pos_x,
          y: el.pos_y,
          zIndex: 2,
          w:
            el.rotation === 0 || el.rotation === 180
              ? el.width - el.pos_x
              : el.font_size,
          h:
          el.rotation === 0 || el.rotation === 180
          ? el.font_size
          : el.height - el.pos_y,
          editSizeW: false,
          editSizeH: false,
          active: el.enabled,
          cls: ["bardcode_container-barcode"],
          clsPreview: "bardcode_container-block-preview",
          style: {
            rotate: el.rotation,
            boxShadow: "none",
          },
        };

        Object.addObjPreiew(obj);
        // }
      }
    });
  };

  return (
    <div className="templates_preiew_container">
      <div className="templates_preiew_list templates_preiew_container_block-left">
        <ListTemplate selectedTemplate={selectedTemplate} />
      </div>

      {Object.objects_preview.length ? (
        <div className="templates_preiew_preview templates_preiew_container_block-right">
          {!service.templatesLoading ? (
            <>
              <ThisLabel
                objects={Object.objects_preview}
                preview={true}
                add_canvas="t"
              />
              <BtnRed text="Удалить" onClick={removeTemplate} />
            </>
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <div className="templates_preiew_preview templates_preiew_container_block-right templates_preiew_container_block-right_text">
          {Memory.templates.length > 0 ? (
            <p>
              Выберите шаблон из списка слева, для предпросмотра. Ваш текуший
              шаблон не перезапишется, пока не нажмёте кнопку "Выбрать шаблон"
            </p>
          ) : (
            <p>
              В базе данных шаблоны отсутствуют. Создайте Ваш первый шаблон,
              сохраните и он отобразиться всписке.
            </p>
          )}
        </div>
      )}
    </div>
  );
});
