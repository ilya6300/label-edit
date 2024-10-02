import React from "react";
import HistoryStore from "../../store/HistoryStore";
import { observer } from "mobx-react-lite";

export const HistoryObj = observer(() => {
  const historyElement = (h) => {
    HistoryStore.selectHistory(h)
  };
  return (
    <ul className="list_props">
      {HistoryStore.objects_history.map((h) => (
        <li className="prop_obj_history" onClick={() => historyElement(h)} key={h.all_time}>
          {h.time}
        </li>
      ))}
    </ul>
  );
});
