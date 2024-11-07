import React, { useEffect, useState } from "react";
import { BtnVer1 } from "../UI/btn/BtnVer1";
import { observer } from "mobx-react-lite";
import { LabelPrintSettingRow } from "../UI/label/LabelPrintSettingRow";
import Memory from "../store/Memory";
import service from "../request/service";
import Msg from "../store/Msg";

export const PrinterSettings = observer(({ setPrinterSetting }) => {
  useEffect(() => {
    if (localStorage.getItem("printer") === null) {
      const printer = {
        host: "127.0.0.1",
        port: 9100,
        number_labels: 1,
        type_printer: "tspl",
        printer_resolution: 300,
        VERSION: "",
        CODEPAGE: "",
        DENSITY: "",
        RIBBON: "",
        SHIFT_X: "",
        SHIFT_Y: "",
        SPEED: "",
      };
      localStorage.setItem("printer", JSON.stringify(printer));
    }
    writeOptionsSettingsPrinter();
  }, []);
  const [host, setHost] = useState("");
  const [hostFlag, setHostFlag] = useState(false);

  const [port, setPort] = useState("");
  const [portFlag, setPortFlag] = useState(false);
  const [count, setCount] = useState("");
  const [countFlag, setCountFlag] = useState(false);
  const [densityFlag, setDensityFlag] = useState(false);
  const [shiftXFlag, setshiftXFlag] = useState(false);
  const [shiftYFlag, setshiftYFlag] = useState(false);

  const [typePrinter, setTypePrinter] = useState("");
  const [printerResolution, setPrinterResolution] = useState("");
  const [version, setVersion] = useState("");
  const [codepage, setCodepage] = useState("");
  const [density, setDensity] = useState("");
  const [shiftX, setShiftX] = useState("");
  const [shiftY, setShiftY] = useState("");
  const [speed, setSpeed] = useState("");

  const setPrinterSettings = () => {
    setshiftXFlag(false);
    setshiftYFlag(false);
    setHostFlag(false);
    setPortFlag(false);
    setCountFlag(false);
    setDensityFlag(false);
  };
  const selectTypePrinter = (e) => {
    setTypePrinter(e.target.value);
  };
  const selectDpiPrinter = (e) => {
    setPrinterResolution(e.target.value);
  };
  const setValue = (e, func) => {
    func(e.target.value);
  };

  const checkSettingsPrinter = async () => {
    try {
      const res = await service.getSettingsPrinter();
      const printer = JSON.parse(localStorage.getItem("printer"));
      printer.printer_resolution = res.DPI;
      printer.VERSION = res.VERSION;
      printer.CODEPAGE = res.CODEPAGE;
      printer.SPEED = res.SPEED;
      printer.DENSITY = res.DENSITY;
      printer.SHIFT_X = res["SHIFT X"];
      printer.SHIFT_Y = res["SHIFT Y"];
      localStorage.setItem("printer", JSON.stringify(printer));
      writeOptionsSettingsPrinter();
    } catch (e) {
      console.error(e);
    }
  };

  const writeOptionsSettingsPrinter = () => {
    const printer = JSON.parse(localStorage.getItem("printer"));
    setHost(printer.host);
    setPort(printer.port);
    setTypePrinter(printer.type_printer);
    setPrinterResolution(printer.printer_resolution);
    setCount(printer.number_labels);
    setVersion(printer.VERSION);
    setCodepage(printer.CODEPAGE);
    setDensity(printer.DENSITY);
    setShiftX(printer.SHIFT_X);
    setShiftY(printer.SHIFT_Y);
    setSpeed(printer.SPEED);
  };

  const settingsPrinter = {
    host:
      JSON.parse(localStorage.getItem("printer")) !== null
        ? JSON.parse(localStorage.getItem("printer")).host
        : "",
    port:
      JSON.parse(localStorage.getItem("printer")) !== null
        ? JSON.parse(localStorage.getItem("printer")).port
        : "",
    type_printer:
      JSON.parse(localStorage.getItem("printer")) !== null
        ? JSON.parse(localStorage.getItem("printer")).type_printer
        : "",
  };

  const rewritPrinting = () => {
    const printer = JSON.parse(localStorage.getItem("printer"));
    printer.host = host;
    printer.port = port;
    printer.number_labels = count;
    printer.type_printer = typePrinter;
    printer.printer_resolution = printerResolution;
    printer.DENSITY = density;
    printer.SHIFT_X = shiftX;
    printer.SHIFT_Y = shiftY;
    localStorage.setItem("printer", JSON.stringify(printer));
    settingsPrinter.host = JSON.parse(localStorage.getItem("printer")).host;
    settingsPrinter.port = JSON.parse(localStorage.getItem("printer")).port;
    settingsPrinter.type_printer = JSON.parse(
      localStorage.getItem("printer")
    ).type_printer;
  };

  const savePrinter = async () => {
    const printer = JSON.parse(localStorage.getItem("printer"));
    const shift_X = printer.SHIFT_X;
    const shift_Y = printer.SHIFT_Y;
    printer.host = host;
    printer.port = port;
    printer.number_labels = count;
    printer.type_printer = typePrinter;
    printer.printer_resolution = printerResolution;
    printer.DENSITY = density;
    printer.SHIFT_X = shiftX;
    printer.SHIFT_Y = shiftY;
    localStorage.setItem("printer", JSON.stringify(printer));
    if (
      Number(shift_X) !== Number(shiftX) ||
      Number(shift_Y) !== Number(shiftY)
    ) {
      settingsPrinter.shift = {
        x: Number(shiftX),
        y: Number(shiftY),
      };
      const res = await service.setSettingsPrinter(settingsPrinter);
      if (!res) {
        Msg.writeMessages(
          "Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети"
        );
        const printer = JSON.parse(localStorage.getItem("printer"));
        printer.SHIFT_X = shift_X;
        printer.SHIFT_Y = shift_Y;
        localStorage.setItem("printer", JSON.stringify(printer));
      }
    }
  };

  const printCalibration = async () => {
    rewritPrinting();
    settingsPrinter.calibration = true;
    const res = await service.setSettingsPrinter(settingsPrinter);
    if (!res) {
      Msg.writeMessages(
        "Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети"
      );
    }
  };

  return (
    <div className="printer_setting_container">
      <p className="printer_setting_title">Параметры принетра</p>
      <div className="printer_setting_column_container">
        <ul className="printer_setting_column">
          <LabelPrintSettingRow
            type="text"
            name="ip-адрес:"
            flag={hostFlag}
            onClickFlag={() => setHostFlag(!hostFlag ? true : false)}
            value={host}
            option={host}
            onChange={(e) => setHost(e.target.value)}
            onClick={() => setPrinterSettings("host", host)}
          />
          <LabelPrintSettingRow
            type="number"
            name="Порт:"
            flag={portFlag}
            onClickFlag={() => setPortFlag(!portFlag ? true : false)}
            value={port}
            option={port}
            onChange={(e) => setValue(e, setPort)}
            onClick={() => setPrinterSettings("port", port)}
          />
          <LabelPrintSettingRow
            type="number"
            name="Кол-во:"
            flag={countFlag}
            onClickFlag={() => setCountFlag(!countFlag ? true : false)}
            value={count}
            option={count}
            onChange={(e) => setValue(e, setCount)}
            onClick={() => setPrinterSettings("number_labels", count)}
          />
          <li className="printer_setting_row">
            Тип принтера:
            <div className="printer_setting_radio_btn_container">
              <label
                className="printer_setting_radio_label"
                style={{
                  color:
                    typePrinter === "tspl" ? "var(--mast-blue-1)" : "#8f8c8ce0",
                }}
              >
                tspl
                <input
                  checked={typePrinter === "tspl" ? true : false}
                  className="printer_setting_radio_btn"
                  name="printer"
                  type="radio"
                  value="tspl"
                  onChange={selectTypePrinter}
                />
              </label>
              <label
                style={{
                  color:
                    typePrinter === "ezpl" ? "var(--mast-blue-1)" : "#8f8c8ce0",
                }}
                className="printer_setting_radio_label"
              >
                ezpl
                <input
                  checked={typePrinter === "ezpl" ? true : false}
                  className="printer_setting_radio_btn"
                  name="printer"
                  type="radio"
                  value="ezpl"
                  onChange={selectTypePrinter}
                />
              </label>
            </div>
          </li>
          {Memory.visible_printer_settings ? (
            <>
              <li className="printer_setting_row">
                dpi:
                <div className="printer_setting_radio_btn_container">
                  <label
                    className="printer_setting_radio_label"
                    style={{
                      color:
                        printerResolution == 200
                          ? "var(--mast-blue-1)"
                          : "#8f8c8ce0",
                    }}
                  >
                    200
                    <input
                      checked={printerResolution == 200 ? true : false}
                      className="printer_setting_radio_btn"
                      name="dpi"
                      type="radio"
                      value="200"
                      onChange={selectDpiPrinter}
                    />
                  </label>
                  <label
                    className="printer_setting_radio_label"
                    style={{
                      color:
                        printerResolution == 300
                          ? "var(--mast-blue-1)"
                          : "#8f8c8ce0",
                    }}
                  >
                    300
                    <input
                      checked={printerResolution == 300 ? true : false}
                      className="printer_setting_radio_btn"
                      name="dpi"
                      type="radio"
                      value="300"
                      onChange={selectDpiPrinter}
                    />
                  </label>
                </div>
              </li>
              <li className="printer_setting_row">
                Версия ПО: <span>{version}</span>
              </li>
              <LabelPrintSettingRow
                type="number"
                name="Смещение ТПГ по X:"
                flag={shiftXFlag}
                onClickFlag={() => setshiftXFlag(!shiftXFlag ? true : false)}
                value={shiftX}
                option={shiftX}
                onChange={(e) => setValue(e, setShiftX)}
                onClick={() => setPrinterSettings("SHIFT_X", shiftX)}
              />
              <LabelPrintSettingRow
                type="number"
                name="Смещение ТПГ по Y:"
                flag={shiftYFlag}
                onClickFlag={() => setshiftYFlag(!shiftYFlag ? true : false)}
                value={shiftY}
                option={shiftY}
                onChange={(e) => setValue(e, setShiftY)}
                onClick={() => setPrinterSettings("SHIFT_Y", shiftY)}
              />
              <li className="printer_setting_row">
                {" "}
                Плотность печати:<span>{density}</span>
              </li>
              <li className="printer_setting_row">
                Скорость печати: <span>{speed}</span>
              </li>
              <li className="printer_setting_row">
                Страница кодировки: <span>{codepage}</span>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
        <div className="printer_setting_btn_container">
          <div className="printer_setting_btn_action">
            <BtnVer1 onClick={checkSettingsPrinter}>Считать настройки</BtnVer1>
            <BtnVer1 onClick={printCalibration}>Калибровка</BtnVer1>
          </div>
          <BtnVer1 onClick={savePrinter}>Применить настройки</BtnVer1>
        </div>
      </div>
    </div>
  );
});
