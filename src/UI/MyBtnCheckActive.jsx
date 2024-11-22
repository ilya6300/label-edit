import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

export const MyBtnCheckActive = observer((props) => {
  const [active, setActive] = useState(props.active);

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  return (
    <>
      {active ? (
        <label onClick={props.onClick} className="my_btn_check_active_true">
          {" "}
          <span className="my_btn_check_active_true_span"></span>
        </label>
      ) : (
        <label onClick={props.onClick} className="my_btn_check_active_false">
          {" "}
          <span className="my_btn_check_active_false_span"></span>
        </label>
      )}
    </>
  );
});
