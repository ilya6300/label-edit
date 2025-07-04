import React, { useState } from "react";
import { PrinterSettings } from "../../features/setting/PrinterSettings";
import Theme from "../../store/Theme";
import { SettingsApp } from "./SettingsApp";

export const Setting = ({
  flagPrinter,
  setFlagPrinter,
  flagApp,
  setFlagApp,
}) => {
  // const [flagApp, setFlagApp] = useState(true);
  // const [flagPrinter, setFlagPrinter] = useState(false);

  const switchTab = (appBoolean, printerBoolean) => {
    setFlagApp(appBoolean);
    setFlagPrinter(printerBoolean);
  };

  return (
    <div
      className="setting_container"
      style={{ background: Theme.background, border: Theme.theme_border }}
    >
      <p className="printer_setting_title">Настройки</p>

      <div className="nav_setting_container">
        <div className="nav_setting_container_btn">
          <span
            onClick={() => switchTab(true, false)}
            style={{ color: flagApp ? "var(--mast-blue-1)" : "#8f8c8ce0" }}
            className="nav_tab_setting_btn"
            onMouseMove={(e) => (e.target.style.color = "var(--mast-blue-1)")}
            onMouseOut={(e) =>
              (e.target.style.color = flagApp
                ? "var(--mast-blue-1)"
                : "#8f8c8ce0")
            }
          >
            Приложение
          </span>
          <span
            onClick={() => switchTab(false, true)}
            style={{ color: flagPrinter ? "var(--mast-blue-1)" : "#8f8c8ce0" }}
            className="nav_tab_setting_btn"
            onMouseMove={(e) => (e.target.style.color = "var(--mast-blue-1)")}
            onMouseOut={(e) =>
              (e.target.style.color = flagPrinter
                ? "var(--mast-blue-1)"
                : "#8f8c8ce0")
            }
          >
            Принтер
          </span>
        </div>
      </div>
      {flagApp ? <SettingsApp /> : <></>}
      {flagPrinter ? <PrinterSettings /> : <></>}
    </div>
  );
};
