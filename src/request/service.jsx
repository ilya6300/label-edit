import axios from "axios";
import { makeAutoObservable } from "mobx";
import Fonts from "../store/Fonts";

class service {
  constructor() {
    makeAutoObservable(this);
  }
  // Переменные
  server_url = "http://10.76.10.37:8025/api/v2/";
  images = [];
  imgLoading = true;
  fontsLoading = true;

  // Получить все изображения
  getImages = async () => {
    this.imgLoading = true;
    try {
      const res = await axios.get(this.server_url + `images/`);
      console.log(res.data["data"]["response"]);
      this.images = res.data["data"]["response"];
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
      const res = await axios.post(this.server_url + `images/`, {
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
      const res = await axios.post(this.server_url + `fonts/`, {
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
      const res = await axios.get(this.server_url + `fonts/`);
      console.log(res.data["data"]["response"]);
      Fonts.fonts = res.data["data"]["response"];
    } catch (e) {
      console.log(e);
    } finally {
        this.fontsLoading = false;
    }
  };
}

export default new service();
