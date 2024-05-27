import React from "react";
import imgBrowserNotSupported from "../../img/firefox-icon_not.png";

export const BrowserNotSupported = () => {
  return (
    <div className="error_container">
      <p className="error_text">
        Браузер Firefox не поддерживается, пожалуйста, используйте: GoogleChrom,
        YandexBrowser, Opera, Edge
      </p>
      <img
        className="img_error"
        src={imgBrowserNotSupported}
        alt=""
        srcset=""
      />
    </div>
  );
};
