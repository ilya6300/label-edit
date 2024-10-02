import React, { useEffect, useState } from "react";
import { BtnVer1 } from "../UI/btn/BtnVer1";

export const PrinterSettings = ({ setPrinterSetting }) => {
  useEffect(() => {
    if (localStorage.getItem("printer") === null) {
      const printer = {
        host: "127.0.0.1",
        port:9100,
        number_labels: 1,
        type_printer: "tspl",
        printer_resolution: 300,
      };
      localStorage.setItem("printer", JSON.stringify(printer));
    }
    const printer = JSON.parse(localStorage.getItem("printer"));
    setHost(printer.host);
    setPort(printer.port);
    setTypePrinter(printer.type_printer);
    setPrinterResolution(printer.printer_resolution);
    setCount(printer.number_labels);
  }, []);
  const [host, setHost] = useState("");
  const [hostFlag, setHostFlag] = useState(false);

  const [port, setPort] = useState("");
  const [portFlag, setPortFlag] = useState(false);
  const [count, setCount] = useState("");
  const [countFlag, setCountFlag] = useState(false);
  const [typePrinter, setTypePrinter] = useState("");
  const [printerResolution, setPrinterResolution] = useState("");
  const setPrinterSettings = () => {
    // const printer = JSON.parse(localStorage.getItem("printer"));
    // console.log(printer[`${name}`]);
    // printer[`${name}`] = value;
    // localStorage.setItem("printer", JSON.stringify(printer));
    setHostFlag(false);
    setPortFlag(false);
    setCountFlag(false);
  };
  const selectTypePrinter = (e) => {
    setTypePrinter(e.target.value);
    console.log(e.target.value);
  };
  const selectDpiPrinter = (e) => {
    setPrinterResolution(e.target.value);
    console.log(e.target.value);
  };
  const setPortValue = (e) => {
    if (e.target.value >= 0) {
      setPort(e.target.value);
    }
  };
  const setCountValue = (e) => {
    if (e.target.value >= 0) {
      setCount(e.target.value);
    }
  };

  const savePrinter = () => {
    const printer = JSON.parse(localStorage.getItem("printer"));
    printer.host = host;
    printer.port = port;
    printer.number_labels = count;
    printer.type_printer = typePrinter;
    printer.printer_resolution = printerResolution;
    localStorage.setItem("printer", JSON.stringify(printer));
    setPrinterSetting(false);
  };
  return (
    <ul className="printer_setting_container">
      <li className="printer_setting_title">Параметры принетра</li>
      <li className="printer_setting_row">
        ip-адрес:
        {!hostFlag ? (
          <span
            className="printer_setting_row_value"
            onClick={() => setHostFlag(!hostFlag ? true : false)}
          >
            {host}
          </span>
        ) : (
          <label>
            <input
              className="printer_setting_row_inpt"
              placeholder={host}
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
            <BtnVer1 onClick={() => setPrinterSettings("host", host)}>
              Ок
            </BtnVer1>
          </label>
        )}
      </li>
      <li className="printer_setting_row">
        порт:
        {!portFlag ? (
          <span
            className="printer_setting_row_value"
            onClick={() => setPortFlag(!portFlag ? true : false)}
          >
            {port}
          </span>
        ) : (
          <label>
            <input
              type="number"
              className="printer_setting_row_inpt"
              placeholder={port}
              value={port}
              onChange={setPortValue}
            />
            <BtnVer1 onClick={() => setPrinterSettings("port", port)}>
              Ок
            </BtnVer1>
          </label>
        )}
      </li>
      <li className="printer_setting_row">
        Кол-во:
        {!countFlag ? (
          <span
            className="printer_setting_row_value"
            onClick={() => setCountFlag(!countFlag ? true : false)}
          >
            {count}
          </span>
        ) : (
          <label>
            <input
              type="number"
              className="printer_setting_row_inpt"
              placeholder={count}
              value={count}
              onChange={setCountValue}
            />
            <BtnVer1 onClick={() => setPrinterSettings("number_labels", count)}>
              Ок
            </BtnVer1>
          </label>
        )}
      </li>
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

      <li className="printer_setting_row">
        dpi:
        <div className="printer_setting_radio_btn_container">
          <label
            className="printer_setting_radio_label"
            style={{
              color:
                printerResolution == 200 ? "var(--mast-blue-1)" : "#8f8c8ce0",
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
                printerResolution == 300 ? "var(--mast-blue-1)" : "#8f8c8ce0",
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
      <li className="printer_setting_closed">
        <BtnVer1 onClick={savePrinter}>Записать и закрыть</BtnVer1>
      </li>
    </ul>
  );
};

// "host": "string",
// "port": 0,
// "number_labels": 1,
// "type_printer": "ezpl",
// "printer_resolution": 300
