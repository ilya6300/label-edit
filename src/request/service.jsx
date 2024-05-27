import axios from "axios";
import { makeAutoObservable } from "mobx";
import Fonts from "../store/Fonts";
import Memory from "../store/Memory";
import Templates from "../store/Templates";
import { request } from "./service.config";

class service {
  constructor() {
    makeAutoObservable(this);
  }
  // Переменные
  server_url = "http://10.76.10.37:8033/api/v1/";
  // server_url = "http://10.76.10.37:3000/api/v1/";
  images = [];
  imgLoading = true;
  fontsLoading = true;
  templatesLoading = true;
  tempImgLoading = true;
  templatesListLoading = true;
  errorNetwork = false;

  // Получить все изображения
  getImages = async () => {
    this.imgLoading = true;
    try {
      const res = await request.get(`images/`);
      console.log(res.data);
      if (res.data["data"].length !== 0) {
        this.images = res.data["data"]["response"];
      }
    } catch (e) {
      console.log(e);
    } finally {
      //   setTimeout(() => {
      this.imgLoading = false;
      //   }, 1000);
    }
  };
  //   Загрузить изображение на сервер
  postImg = async (name, file) => {
    try {
      const res = await request.post(`images/`, {
        name: name,
        data: file,
      });

      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      this.getImages();
    }
  };

  //   Загрузить шрифт
  postFont = async (name, file) => {
    console.log(name, file);
    try {
      const res = await request.post(`fonts/`, {
        name: String(name),
        data: file,
      });
      console.log(res);
    } catch (e) {
      console.log(e);
    } finally {
      this.getFonts();
    }
  };
  // Получить все шрифты
  getFonts = async () => {
    this.fontsLoading = true;
    try {
      const res = await request.get(`fonts/`);
      if (res.data.success) {
        console.log(res.data);
        Fonts.fonts = res.data["data"]["response"];
      }

      // Fonts.defaultFont(res.data["data"]["response"][0]);
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_NETWORK") {
        return (this.errorNetwork = true);
      }
    } finally {
      this.fontsLoading = false;
    }
  };

  //   Загрузить шаблон
  postTemplate = async (obj) => {
    console.log(obj);
    try {
      const res = await request.post(`form_labels/`, obj);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  // Получить все шаблоны
  getTemplates = async () => {
    this.templatesListLoading = true;
    try {
      const res = await request.get(`template_list/`);
      console.log(res.data["data"].length !== 0);
      if (res.data["data"].length !== 0) {
        Memory.templates = res.data["data"]["response"];
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.templatesListLoading = false;
    }
  };
  // Получить шаблон по id
  getTemplatesID = async (id) => {
    this.templatesLoading = true;
    try {
      const res = await request.get(`form_labels/${id}`);
      console.log(res.data["data"]);
      return (Templates.preview_templates = res.data["data"]);
    } catch (e) {
      console.log(e);
    } finally {
      Memory.writeNameTemplate();
      this.templatesLoading = false;
    }
  };
  // Обновление существующих объектов внутри шаблона
  pathUpdateObj = async (obj) => {
    try {
      const res = await request.patch(`form_labels/field`, obj);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  // Обновление параметров этикетки
  pathUpdateLabel = async (label) => {
    try {
      const res = await request.patch(
       `form_labels/label/` + Templates.preview_templates.id,
        label
      );
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  // Удаление объекта
  deleteObj = async (objects) => {
    const deleteData = {
      method: "delete",
      maxBodyLength: Infinity,
      url: "form_labels/field",
      headers: {
        "Content-Type": "application/json",
      },
      data: { id_fields: objects },
    };
    console.log(objects);
    try {
      const res = await request(deleteData);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
  // Добавить объект в существующий шаблон
  addNewObj = async (objects) => {
    const newObj = {
      template_id: Templates.preview_templates.id,
      object: objects,
    };
    console.log(newObj);
    try {
      const res = await request.post("template_fields", newObj);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  // Удалить шаблон
  deleteTemplate = async () => {
    const deleteTemplate = {
      method: "delete",
      maxBodyLength: Infinity,
      url: "template_list",
      headers: {
        "Content-Type": "application/json",
      },
      data: { id_label: [Templates.preview_templates.id] },
    };

    try {
      const res = await request(deleteTemplate);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };
}

export default new service();
