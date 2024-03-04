import { makeAutoObservable } from "mobx";

class Memory {
  mm = 3.779575175750246;
  //  Переменные этикетки
  width_label = 58
  height_label = 40
  radius_label = 5

  


  constructor() {
    makeAutoObservable(this);
  }

  widthLabelChange = (value) => {
    this.width_label = value
  }
  heigthLabelChange = (value) => {
    this.height_label = value
  }
  radiusLabelChange = (value) => {
    this.radius_label = value
  }

  updateFlagPropsObj = (boolean) => {
    this.flag_update_props_obj = boolean;
  };
}

export default new Memory();
