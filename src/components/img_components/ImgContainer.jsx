import React, { useEffect, useRef, useState } from "react";
import service from "../../request/service";
import { observer } from "mobx-react-lite";
import { Loader } from "../Loader";
import { Preview } from "../Preview";
import { ListImg } from "./ListImg";

export const ImgContainer = observer(({ setImgBD, createImg }) => {
  useEffect(() => {
    service.getImages();
  }, []);

  const [preview, setPreview] = useState(false);
  const [previewSelect, setPreviewSelect] = useState(false);

  const refContainer = useRef(null);
  const inpFile = useRef(null);
  const [valueImg, setValueImg] = useState(null);
  const [idImg, setIdImg] = useState(null);
  // const [valueBase64, setValueBase64] = useState("");
  const [name, setName] = useState("");

  const addImg = () => {
    inpFile.current.click();
  };

  const selectedFile = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files.length === 0) {
      return;
    }
    if (e.target.files[0].type !== "image/bmp") {
      return alert(
        "Вы пытаетесь добавить файл " +
          e.target.files[0].type +
          ". Вы можете загрузить только изображение с форматом .bmp"
      );
    }
    if (e.target.files[0].size > 512000) {
      return alert(
        "Превышен максимальный размер файла. Максимальный разрешённый размер 515 Кб"
      );
    }
    console.log(e.target.files[0].type);
    setValueImg(e.target.files[0]);
    setPreview(true);
    refContainer.current.style.overflow = "hidden";
  };

  const sendFile = async (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      service.postImg(name, reader.result);
      console.log(reader.result);
      // setValueBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // выбор img и добавлениек в шаблон
  const actionImg = (e) => {
    console.log(e);
    if (preview) {
      if (name.length < 3) {
        return alert("Минимальная длина названия 3 символов");
      }
      sendFile(valueImg);
      setPreview(false);
      setName("");
    }
    if (previewSelect) {
      createImg(valueImg, idImg);
      setPreviewSelect(true);
      setName("");
    }
  };

  const getThisImg = (e) => {
    console.log(e.data);
    setValueImg(e.data);
    setName(e.name);
    setIdImg(e.id);
    setPreviewSelect(true);
  };

  const closedContainer = () => {
    refContainer.current.style.overflow = "hidden scroll";
    if (preview) {
      setPreview(false);
    }
    if (previewSelect) {
      setPreviewSelect(false);
    }
  };

  return (
    <div ref={refContainer} className="add_obj_img">
      <div className="container_list_img">
        <li className="add_obj-title">
          Из списка{" "}
          <span
            className="container_closed_btn"
            onClick={() => setImgBD(false)}
          ></span>
        </li>
        <li className="add_obj-title_new">
          Добавить
          <span className="container_add_btn" onClick={() => addImg()}>
            {" "}
            <input
              ref={inpFile}
              onChange={selectedFile}
              type="file"
              accept=".bmp"
              className="hidden"
            />
          </span>
        </li>
        {!service.imgLoading ? <ListImg getThisImg={getThisImg} /> : <Loader />}
      </div>

      {preview ? (
        <Preview
          actionImg={actionImg}
          valueImg={URL.createObjectURL(valueImg)}
          name_btn="Сохранить"
          preview={true}
          name={name}
          setName={setName}
          closedContainer={closedContainer}
        />
      ) : (
        <></>
      )}
      {previewSelect ? (
        <Preview
          actionImg={actionImg}
          name_btn="Выбрать"
          name={name}
          closedContainer={closedContainer}
          valueImg={valueImg}
          preview={false}
        />
      ) : (
        <></>
      )}
    </div>
  );
});
