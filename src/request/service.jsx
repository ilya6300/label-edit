import { makeAutoObservable, toJS } from "mobx";
import Fonts from "../store/Fonts";
import Memory from "../store/Memory";
import Templates from "../store/Templates";
import { request } from "./service.config";
import { request_dm } from "./service.sizedm";
import Msg from "../store/Msg";
import Object from "../store/Object";
import config from "../config.json";
import axios from "axios";

class service {
  constructor() {
    makeAutoObservable(this);
  }
  // Переменные
  server_url = config.url_api;
  // server_url = "http://10.76.10.37:3000/api/v1/";
  images = [];
  imgLoading = true;
  fontsLoading = true;
  templatesLoading = true;
  tempImgLoading = true;
  templatesListLoading = true;
  errorNetwork = false;
  dm_table = [];

  // Получить все переменные
  getVar = async () => {
    try {
      const res = await request.get("template_list/print_variables/");
      Memory.varDateWrite(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Получить все изображения
  getImages = async () => {
    this.imgLoading = true;
    try {
      const res = await request.get(`images/`);
      console.log(toJS(res.data["data"]["response"]));
      if (res.data["data"].length !== 0) {
        this.images = res.data["data"]["response"];
        this.images.forEach((el) => {
          el.data = atob(el.data);
        });
        console.log(toJS(this.images));
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.imgLoading = false;
    }
  };
  //   Загрузить изображение на сервер
  postImg = async (name, file) => {
    try {
      const res = await request.post(`images/`, {
        name: name,
        tag_images: Memory.regPost(name) + ".BMP",
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
        tag_fonts: Memory.regPost(String(name)) + ".TTF",
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
        Fonts.fonts = [...res.data["data"]["response"]];
      }
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_NETWORK") {
        return (this.errorNetwork = true);
      }
    } finally {
      this.getVar();
      this.fontsLoading = false;
    }
  };

  //   Загрузить шаблон
  postTemplate = async (obj) => {
    console.log(obj);
    try {
      const res = await request.post(`form_labels/`, obj);
      console.log(res);
      if (!res.data.success) {
        Memory.visiblePost(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      Msg.writeMessages("Шаблон успешно сохранён");
    }
  };
  // Получить все шаблоны
  getTemplates = async () => {
    this.templatesListLoading = true;
    try {
      const res = await request.get(`template_list/`);
      console.log(res.data["data"]);
      if (res.data["data"].length !== 0) {
        Memory.templates = res.data["data"]["response"];
      } else {
        Memory.templates = [];
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
      if (!res.data.success) {
        Memory.visiblePost(true);
      }
      console.log(res.data);
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
    } finally {
      this.getTemplates();
      Object.resetPreiew();
      Templates.preview_templates = [];
      Templates.downloaded_template = [];
    }
  };

  // Получить таблицу размеров DM
  getSizeDM = async () => {
    try {
      const res = await request("template_list/dm");
      console.log(res.data["data"]);
      this.dm_table = res.data["data"];
    } catch (e) {
      console.log(e);
    }
  };

  trialPrint = async () => {
    try {
      const res = await request.post(`trial_printing`, {
        template: {
          id_template: Templates.template_id,
          is_update: true,
        },
        setting_printer: JSON.parse(localStorage.getItem("printer")),
      });
      console.log(res);
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
        Msg.writeMessages(
          "Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен."
        );
      }
      console.log(e);
    }
  };
}

export default new service();
