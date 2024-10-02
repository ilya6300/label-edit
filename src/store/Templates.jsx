import { makeAutoObservable } from "mobx";
import Object from "./Object";

class Templates {
  constructor() {
    makeAutoObservable(this);
  }

  template_id = null;
  preview_templates = {};
  downloaded_template = [];

  downloadedTemplates = (collection) => {
    console.log(Object.objects_preview);
    this.downloaded_template = JSON.parse(
      JSON.stringify(collection)
    );
  };

  saveID = (id) => {
    this.template_id = id;
  };
}
export default new Templates();
