import { makeAutoObservable } from "mobx";
import Object from "./Object";
class history {
  constructor() {
    makeAutoObservable(this);
  }
  objects_history = [];
  current_object = null;
  historyIndex = 0;

  incrementReturnHistory = () => {
    if (this.historyIndex + 1 <= this.objects_history.length) {
      Object.objects = this.objects_history[this.historyIndex].objects;
      this.historyIndex = this.historyIndex + 1;
    }
  };

  decrementReturnHistory = () => {
    if (this.historyIndex > 0) {
      this.historyIndex = this.historyIndex - 1;
      Object.objects = this.objects_history[this.historyIndex].objects;
    }
  };

  writeHistory = () => {
    const t = new Date();
    const temp_history = Object.objects.filter((obj) => obj.id !== 9999);
    this.current_object = JSON.parse(JSON.stringify(temp_history));
    this.objects_history.unshift({
      objects: JSON.parse(JSON.stringify(temp_history)),
      time: t.toLocaleTimeString("it-IT"),
      all_time: t.getTime(),
    });
    if (this.objects_history.length > 30) {
      this.objects_history.pop();
    }
  };
  addHistory = () => {
    if (
      this.objects_history.length !== 0 &&
      JSON.stringify(this.current_object) !== JSON.stringify(Object.objects)
    ) {
      this.writeHistory();
    }
    if (this.objects_history.length === 0) {
      this.writeHistory();
    }
  };

  selectHistory = (h) => {
    Object.objects = h.objects;
    this.current_object = h.objects;
  };
}
export default new history();
