import { makeAutoObservable } from "mobx";

class Fonts {
  default_font = {};
  fonts = [
    // { id: 9999, name: "0" }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  defaultFont = (font) => {
    this.default_font = font;
  };
}

export default new Fonts();
