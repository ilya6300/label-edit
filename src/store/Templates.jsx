import { makeAutoObservable } from "mobx";
import Object from "./Object";

class Templates {
  constructor() {
    makeAutoObservable(this);
  }
  preview_templates = {};
  downloaded_template = [];

  // resetTemplate = () => {
  //   this.preview_templates = {};
  // };


  downloadedTemplates = () => {
    console.log(Object.objects_preview)
    this.downloaded_template = JSON.parse(JSON.stringify(Object.objects_preview));
  };

  // Получить шаблон по id
}
export default new Templates();
