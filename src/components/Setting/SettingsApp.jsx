import React from "react";
import { ItemRowSettingApp } from "./ItemRowSettingApp";
import Theme from "../../store/Theme";
import { observer } from "mobx-react-lite";

export const SettingsApp = observer(() => {
  const setThemeFunc = async () => {};

  return (
    <ul className="printer_setting_column">
      <ItemRowSettingApp
        name="Тёмная тема"
        active={Theme.black_theme}
        onClick={Theme.setTheme}
      />
    </ul>
  );
});
