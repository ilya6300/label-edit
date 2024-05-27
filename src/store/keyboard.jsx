import { makeAutoObservable, toJS } from "mobx";

class keys {
  constructor() {
    makeAutoObservable(this);
  }

  shift_key = false;

  trueShift = () => {
    this.shift_key = true;
  };
  falseShift = () => {
    this.shift_key = false;
  };
}

export default new keys();
