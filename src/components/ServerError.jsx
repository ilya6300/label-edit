import React, { useEffect } from "react";
import serverErrorImg from "../img/servererror.png";
import Memory from "../store/Memory";
import Theme from "../store/Theme";

export const ServerError = () => {
  useEffect(() => {
    Memory.exchangeFlag(false);
  }, []);
  return (
    <div className="error_container">
      <p className="error_text" style={{ color: Theme.color }}>
        Сервер этикеток недоступен попробуйте позже
      </p>
      <img
        className="img_error"
        src={serverErrorImg}
        alt=""
        srcset=""
        style={{ filter: Theme.black_theme ? "invert(1)" : "none" }}
      />
    </div>
  );
};
