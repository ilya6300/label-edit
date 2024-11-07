import { makeAutoObservable } from "mobx";

class Fonts {
  default_font = {};
  fonts = [
  ];

  constructor() {
    makeAutoObservable(this);
  }

  defaultFont = (font) => {
    this.default_font = font;
  };
}

export default new Fonts();
