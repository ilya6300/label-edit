import React from "react";
import { Loader } from "../Loader";

export const ContainerPostDownloader = () => {
  return (
    <div className="label_container-post_downloader">
      <Loader />
      <h1 className="post_downloader_body">Пожалуйста, подождите, идёт сохранение шаблона...</h1>
    </div>
  );
};
