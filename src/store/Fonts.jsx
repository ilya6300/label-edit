import { makeAutoObservable } from "mobx";

class Fonts {
  default_font = {};
  fonts = [];

  constructor() {
    makeAutoObservable(this);
  }

  defaultFont = (font) => {
    this.default_font = font;
    console.log(this.default_font);
  };
}

export default new Fonts();
