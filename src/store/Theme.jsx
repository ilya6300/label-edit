import { makeAutoObservable } from "mobx";

class Theme {
  constructor() {
    makeAutoObservable(this);
  }

  black_theme = false;
  color = "black";
  background = "white";
  theme_border = "1px solid #0000001f";
  btn_background_black = "#F0F0F0";
  label_background_black = "#f6e3bd";

  setBlackThemeStyle = () => {
    this.color = "#b2b2b2d1";
    this.background = "#000000e3";
    this.theme_border = "1px solid #2196f3";
    this.btn_background_black = "rgb(63 68 73 / 83%)";
    this.label_background_black = "#a0a0a01c";
  };

  setWhiteThemeStyle = () => {
    this.color = "black";
    this.background = "white";
    this.theme_border = "1px solid #0000001f";
    this.btn_background_black = "#F0F0F0";
    this.label_background_black = "#f6e3bd";
  };

  getBlackTheme = async () => {
    const storageTheme = localStorage.getItem("black_theme");
    if (storageTheme === null) {
      localStorage.setItem("black_theme", false);
    } else {
      this.black_theme = JSON.parse(storageTheme);
      if (JSON.parse(storageTheme)) {
        this.setBlackThemeStyle();
      }
    }
  };
  setTheme = async () => {
    if (!this.black_theme) {
      this.black_theme = true;
      localStorage.setItem("black_theme", true);
      this.setBlackThemeStyle();
    } else {
      this.black_theme = false;
      localStorage.setItem("black_theme", false);
      this.setWhiteThemeStyle();
    }
  };
}
export default new Theme();
