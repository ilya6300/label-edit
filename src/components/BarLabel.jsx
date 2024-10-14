import React, { useRef, useState } from "react";
import Memory from "../store/Memory";
import { observer } from "mobx-react-lite";
import Object from "../store/Object";
import { BtnVer1 } from "../UI/btn/BtnVer1";
import { LabelInpVer1 } from "../UI/label/LabelInpVer1";
import { PostCompanent } from "./PostCompanent";
import Templates from "../store/Templates";
import service from "../request/service";
import { BarInfo } from "./BarInfo";
import HistoryStore from "../store/HistoryStore";
import { ImportCompanent } from "./import/ImportCompanent";
import iconSettings from "../img/icons/icon-settings.png";
import Msg from "../store/Msg";
import { CodeTemplayModal } from "./templates/CodeTemplayModal";

export const BarLabel = observer(
  ({
    setFlagPrevier,
    flagPreview,
    setVisibleTemplates,
    visibleTemplates,
    setClsMM,
    clsMM,
    setImportC,
    setPrinterSetting,
    printerSetting,
  }) => {
    const [wValuse, setWValue] = useState(Memory.width_label);
    const [hValuse, setHValue] = useState(Memory.height_label);
    const [rValuse, setRValue] = useState(Memory.radius_label);
    const [gValuse, setGValue] = useState(Memory.gap);
    const [direction1, setDirection1] = useState(Memory.DIRECTION_1);
    const [direction2, setDirection2] = useState(Memory.DIRECTION_2);
    const [refX, setRefX] = useState(Memory.ref_x);
    const [refY, setRefY] = useState(Memory.ref_y);

    // Имя шаблона
    const [valueName, setValueName] = useState(Memory.name_template);
    const refCodeImport = useRef();

    const [visibleCodeTemplateFlag, setVisibleCodeTemplateFlag] =
      useState(false);

    const changeW = (e) => {
      if (e.target.value > 150) {
        setWValue(150);
        Memory.widthLabelChange(150);
      } else {
        setTimeout(() => {
          if (e.target.value < 15) {
            setWValue(15);
            Memory.widthLabelChange(15);
          }
        }, 1000);
        setWValue(e.target.value);
        Memory.widthLabelChange(e.target.value);
      }
    };
    const changeH = (e) => {
      if (e.target.value > 400) {
        setHValue(400);
        Memory.heigthLabelChange(400);
      } else {
        setTimeout(() => {
          if (e.target.value < 15) {
            setHValue(15);
            Memory.heigthLabelChange(15);
          }
        }, 1000);
        setHValue(e.target.value);
        Memory.heigthLabelChange(e.target.value);
      }
    };
    const changeR = (e) => {
      if (e.target.value > 50) {
        setRValue(50);
        Memory.radiusLabelChange(50);
      } else if (e.target.value <= 0) {
        setRValue(0);
        Memory.radiusLabelChange(0);
      } else {
        setRValue(e.target.value);
        Memory.radiusLabelChange(e.target.value);
      }
    };

    const changeG = (e) => {
      if (e.target.value > 10) {
        return;
      }
      setGValue(e.target.value);
      Memory.gapLabelChange(e.target.value);
    };

    const reset = () => {
      Object.reset();
      Memory.updateFlagPropsObj(false);
      Object.setPropObj(null);
    };

    const preview = () => {
      if (flagPreview) {
        setFlagPrevier(false);
      } else {
        setFlagPrevier(true);
        setTimeout(() => {
          Object.editBodyPreview();
        }, 100);
      }
    };

    const changeDirection = (e) => {
      let targetValue = Number(e.target.value);
      if (targetValue.length > 1) {
        return;
      }
      if (Number(e.target.value) < 0) {
        targetValue = 0;
      }
      if (Number(e.target.value) > 1) {
        targetValue = 1;
      }
      if (Number(e.target.id) === Number(1)) {
        console.log(1);
        Memory.labelDirection1(targetValue);
        setDirection1(targetValue);
      }
      if (Number(e.target.id) === Number(2)) {
        console.log(2);
        Memory.labelDirection2(targetValue);
        setDirection2(targetValue);
      }
    };

    const changeRef = (e) => {
      let value = e.target.value;
      if (e.target.value < 0) {
        value = 0;
      }
      if (e.target.id === "x") {
        if (e.target.value > Memory.width_label) {
          return;
        }
        Memory.labelRefX(value);
        setRefX(value);
      }
      if (e.target.id === "y") {
        if (e.target.value > Memory.height_label) {
          return;
        }
        Memory.labelRefY(value);
        setRefY(value);
      }
    };

    const [temp_wl, setTemp_wl] = useState(0);
    const [temp_hl, setTemp_hl] = useState(0);
    const [temp_rx, setTemp_rx] = useState(0);
    const [temp_ry, setTemp_ry] = useState(0);
    const [temp_d1, setTemp_d1] = useState(0);
    const [temp_d2, setTemp_d2] = useState(0);
    const [temp_g, setTemp_g] = useState(0);

    // показать список шаблонов
    const openTemplates = () => {
      setTemp_wl(Memory.width_label);
      setTemp_hl(Memory.height_label);
      setTemp_rx(Memory.ref_x);
      setTemp_ry(Memory.ref_y);
      setTemp_d1(Memory.DIRECTION_1);
      setTemp_d2(Memory.DIRECTION_2);
      setTemp_g(Memory.gap);
      setVisibleTemplates(true);
      service.getImages();
    };

    const closedTemplates = () => {
      setVisibleTemplates(false);
      setRefX(temp_rx);
      setRefY(temp_ry);
      setDirection1(temp_d1);
      setDirection2(temp_d2);
      Memory.widthLabelChange(temp_wl);
      Memory.heigthLabelChange(temp_hl);
      setGValue(temp_g);
    };

    // Выбрать шаблон
    // const selectTemplate = () => {
    //   setVisibleTemplates(false);
    //   setRefX(Templates.preview_templates.reference_x);
    //   setRefY(Templates.preview_templates.reference_y);
    //   setDirection1(Templates.preview_templates.direction_x);
    //   setDirection2(Templates.preview_templates.direction_y);
    //   setWValue(Templates.preview_templates.width_mm);
    //   setHValue(Templates.preview_templates.height_mm);
    //   setGValue(Templates.preview_templates.gap_mm);
    //   Templates.saveID(Templates.preview_templates.id);
    //   Object.select();
    //   Templates.downloadedTemplates(Object.objects_preview);
    //   setTimeout(() => {
    //     Object.editBodyPreview();
    //   }, 1000);
    // };

    // const deleteTemplate = () => {
    //   console.log(Templates.preview_templates.id);
    //   service.deleteTemplate();
    // };

    // Новый шаблон
    const newTemplateFunc = () => {
      Object.newTemplate();
      Templates.setNewTemplate(true);
    };

    // Включить / отклюяить милимметровую сетку
    const [clsMMBtn, setClsMMBtn] = useState("cls_mm-btn");
    const onMM = () => {
      if (clsMM === "") {
        setClsMMBtn("cls_mm-btn-active");
        setClsMM("cls_mm");
      } else {
        setClsMMBtn("cls_mm-btn");
        setClsMM("");
      }
    };

    const changeDpi = (e) => {
      console.log(e);
      Memory.dpiChange(e.target.value);
    };

    const backStepHistory = () => {
      HistoryStore.incrementReturnHistory();
    };

    const visibleImportC = () => {
      setVisibleTemplates(false);
      setImportC(true);
    };

    const trialPrintFunc = async () => {
      if (Templates.template_id === null) {
        return alert("Сохраните шаблон или выберите из БД");
      }
      if (localStorage.getItem("printer") === null) {
        return setPrinterSetting(true);
      }
      const res = await service.trialPrint();
      if (res.success) {
        setVisibleCodeTemplateFlag(true);
      }
    };

    const importTemplates = async (e) => {
      // reader.readAsText(e.target.files[0]);
      if (!e.target.files[0].name.match(/\.tdmc$/gm)) {
        return Msg.writeMessages(
          "Необходимо загрузить файл типа .tdmc (Template DMC). Экспортированный ранее из редактора этикеток DMC или DMC"
        );
      }
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const resID = await service.importCodeTemplate(reader.result);
          // console.log("resID", resID.data.id);
          if (resID.success !== undefined) {
            await service.getTemplatesID(resID.data.id);
          }
        };
        reader.readAsText(e.target.files[0]);
        console.log(e.target.files[0].name);
      } catch (e) {
        return Msg.writeMessages(e);
      }
      // return Msg.writeMessages("Файл импортирован успешно!");
      e.target.value = null;
      // console.log(e.target.files);
    };

    const getPingPrint = async () => {
      if (localStorage.getItem("printer") === null) {
        return setPrinterSetting(true);
      }
      await service.pingPrinter();
    };

    return (
      <div className="bar_label">
        <span className="barlabel_title">
          <span style={{ width: "150px" }}>
            {Templates.new_template ? "Новый шаблон" : Memory.name_template}
          </span>
          <div className="barlabel_btn_container">
            {!visibleTemplates ? (
              <>
                {/* Редактор */}
                <BtnVer1 onClick={newTemplateFunc}>Создать новый</BtnVer1>
                <BtnVer1 onClick={openTemplates}>Шаблоны</BtnVer1>
                <PostCompanent
                  valueName={valueName}
                  setValueName={setValueName}
                />

                <BtnVer1 onClick={reset}>Очистить текущий</BtnVer1>
                <BtnVer1 flagPreview={flagPreview} onClick={preview}>
                  Предпросмотр
                </BtnVer1>
              </>
            ) : (
              <>
                {/* Окно просмотра шаблона */}

                <input
                  ref={refCodeImport}
                  type="file"
                  accept=".tdmc"
                  style={{ display: "none" }}
                  onChange={importTemplates}
                />
                <BtnVer1 onClick={() => refCodeImport.current.click()}>
                  Импорт из файла
                </BtnVer1>
                <BtnVer1 onClick={visibleImportC}>
                  Импорт кода (строками)
                </BtnVer1>
                <BtnVer1 onClick={closedTemplates}>Закрыть</BtnVer1>
                {/* <BtnVer1 onClick={selectTemplate}>Выбрать шаблон</BtnVer1> */}
                {/* <BtnVer1 onClick={deleteTemplate}>Удалить шаблон</BtnVer1> */}

                {/*  */}
              </>
            )}
            <button onClick={onMM} className={clsMMBtn}>
              #
            </button>
            <span className="btn_back_history" onClick={backStepHistory}></span>
            <BarInfo />
          </div>
        </span>

        <div className="barlabel_container">
          <div className="barlabel_filter_container">
            <label onChange={changeDpi}>
              dpi:{" "}
              <select className="barlabel_container_dpi">
                <option value="12">300</option>
                <option value="8">200</option>
              </select>
            </label>
            <LabelInpVer1
              text="Ширина"
              value={Memory.width_label}
              onChange={changeW}
            />
            <LabelInpVer1
              text="Высота"
              value={Memory.height_label}
              onChange={changeH}
            />
            <LabelInpVer1
              text="Скругление"
              value={Memory.radius_label}
              onChange={changeR}
            />
            <LabelInpVer1 text="Зазор" value={Memory.gap} onChange={changeG} />
            <label>
              Направление:
              <input
                className="barlabel_number"
                type="number"
                id="1"
                value={Memory.DIRECTION_1}
                onChange={changeDirection}
                style={{
                  width: "25px",
                  margin: "0 5px",
                }}
              />
              ,
              <input
                className="barlabel_number"
                type="number"
                id="2"
                value={Memory.DIRECTION_2}
                onChange={changeDirection}
                style={{
                  width: "25px",
                  margin: "0 5px",
                }}
              />
            </label>
            <label>
              Смещение по x:
              <input
                className="barlabel_number"
                type="number"
                id="x"
                value={Memory.ref_x}
                onChange={changeRef}
                style={{
                  width: "40px",
                  margin: "0 5px",
                }}
              />
              y:
              <input
                className="barlabel_number"
                type="number"
                id="y"
                value={Memory.ref_y}
                onChange={changeRef}
                style={{
                  width: "40px",
                  margin: "0 5px",
                }}
              />
            </label>
          </div>
        </div>
        <div className="barlabel_container_suboptions">
          <div className="barlabel_container_scale">
            <span>Масштаб</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.25"
              value={Memory.scale}
              onChange={(e) => Memory.setScaleLabel(e.target.value)}
            />
            <span>{Memory.scale * 100} %</span>
          </div>
          <div className="barlabel_container_printing">
            {visibleCodeTemplateFlag ? (
              <CodeTemplayModal
                setVisibleCodeTemplateFlag={setVisibleCodeTemplateFlag}
              />
            ) : (
              <></>
            )}
            <span>Действия с принтером</span>
            <BtnVer1 onClick={getPingPrint}>Проверка связи</BtnVer1>
            <BtnVer1 onClick={trialPrintFunc}>Пробная печать</BtnVer1>
            <img
              onClick={() => setPrinterSetting(!printerSetting)}
              className="barlabel_setting_printer"
              src={iconSettings}
              alt="Настройки принтера"
              style={{
                animation: printerSetting
                  ? "setting_printing_rotate 3s infinite linear"
                  : "",
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);
