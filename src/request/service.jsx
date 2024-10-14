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
        Fonts.fonts.forEach((f) => {
          const myFont = new FontFace(
            f.name,
            `url(data:application/octet-stream;base64,${f.data})`
          );
          // console.log("data:application/octet-stream;base64," + props.font.data);
          myFont.load();
          document.fonts.add(myFont);
        });
      }
    } catch (e) {
      console.log(e);
      if (e.code === "ERR_NETWORK") {
        return (this.errorNetwork = true);
      }
    } finally {
      this.getVar();
      Fonts.defaultFont(Fonts.fonts[0]);
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
      } else {
        Msg.writeMessages("Шаблон успешно сохранён");
      }
    } catch (e) {
      console.log(e);
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
      Templates.preview_templates = res.data["data"];
      return Templates.convertTemplatesForLabel();
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
      Msg.writeMessages("Шаблон успешно изменён");
      console.log(res.data);
    } catch (e) {
      Msg.writeMessages("Не удалось изменить шаблон.");
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
      // Msg.writeMessages("Не удалось удалить объекты");
      console.error(e);
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
    const ping = await this.pingPrinter(true);
    console.log(ping);
    if (ping !== "Готов к работе") return;
    try {
      const res = await request.post(`trial_printing`, {
        template: {
          id_template: Templates.template_id,
          is_update: true,
        },
        setting_printer: {
          host: JSON.parse(localStorage.getItem("printer")).host,
          port: Number(JSON.parse(localStorage.getItem("printer")).port),
          type_printer: JSON.parse(localStorage.getItem("printer"))
            .type_printer,
          number_labels: Number(JSON.parse(localStorage.getItem("printer")))
            .number_labels,
          printer_resolution: Number(
            JSON.parse(localStorage.getItem("printer")).printer_resolution
          ),
        },
      });
      Templates.setCodeTypeTemplate(res.data);
      return res.data;
    } catch (e) {
      if (e.code === "ERR_NETWORK") {
        Msg.writeMessages(
          "Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью"
        );
      }
      console.log(e);
    }
  };

  pingPrinter = async (trial) => {
    try {
      const res = await request.post("trial_printing/ping", {
        host: JSON.parse(localStorage.getItem("printer")).host,
        port: JSON.parse(localStorage.getItem("printer")).port,
        type_printer: JSON.parse(localStorage.getItem("printer")).type_printer,
      });
      console.log(res.data);
      if (res.data.success) {
        if (!trial || res.data.data !== "Готов к работе") {
          Msg.writeMessages(`Ответ от принетра. ${res.data.data}`);
        }
      } else {
        Msg.writeMessages(`Ошибка принтера. ${res.data.data}`);
      }
      return res.data.data;
    } catch (e) {
      console.log(e);
      return Msg.writeMessages(
        "Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети"
      );
    }
  };

  getSettingsPrinter = async () => {
    try {
      const res = await request(
        `trial_printing/setting?host=${
          JSON.parse(localStorage.getItem("printer")).host
        }&port=${JSON.parse(localStorage.getItem("printer")).port}`
      );
      return res.data["data"];
    } catch (e) {
      console.error(e);
    }
  };

  setSettingsPrinter = async (option) => {
    console.log(option);
    try {
      const res = await request.post(`trial_printing/setting`, option);
      console.log(res);
      return res.data.success;
    } catch (e) {
      console.error(e);
      return Msg.writeMessages(
        "Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети"
      );
    }
  };

  // Получить юникодшаблона
  exportCodeTemplate = async (id) => {
    try {
      const res = await request(`trial_printing/get_template/${id}`);
      return res.data;
    } catch (e) {
      console.error(e);
    }
  };

  importCodeTemplate = async (data) => {
    try {
      const res = await request.post(`trial_printing/save_template`, {
        data: data,
      });
      if (res.data.success) {
        Msg.writeMessages(
          `Файл импортирован успешно! Добавлен в список под именем - ${res.data["data"].name}`
        );
      } else {
        Msg.writeMessages(
          "Не удалось импортировать файл! Содержимое файла имеет некорректный шаблон. Выгрузите, пожалуйста, файл ещё раз из редактора этикеток DMC или DMC. Не открывайте его и не меняйте содержимое, это может привести к повторному сбою при импорте."
        );
      }
      console.log(res);
      return res.data;
    } catch (e) {
      console.log(e);
    } finally {
      this.getTemplates();
    }
  };
}

export default new service();
