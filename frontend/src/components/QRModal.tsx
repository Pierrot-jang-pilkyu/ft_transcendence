import styles from "./QRModal.module.css";
import { LoginContext } from "../App";
import { useState, useRef, useEffect, useContext } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface QRModalProps {
  onClose: () => void; // onClose prop의 타입을 함수 타입으로 지정
}

function QRModal({ onClose }) {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const [qr, setQr] = useState();
  const [login, setLogin] = useContext(LoginContext);
  const [textError, setTextError] = useState(false);
  function onChangeText(event) {
    setText(event.target.value);
  }

  function onClick() {
    axios.defaults.withCredentials = true;
    axios
      .post("http://" + import.meta.env.VITE_BACKEND + "/auth/2fa", {
        code: text,
      })
      .then(() => {
        setLogin(true);
        navigate("/Lobby");
      })
      .catch((error) => {
        setTextError(true);
        setTimeout(() => {
          setTextError(false);
        }, 400);
      });
  }
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onClick();
    }
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    fetch("http://" + import.meta.env.VITE_BACKEND + "/auth/2fa/generate", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => setQr(url))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <div className={`${styles.popup_wrap}`}>
          <div className={`${styles.popup}`}>
            <div>
              <span className={`${styles.logo}`}>QR 인증</span>
            </div>
            <img src={qr} className={`${styles.qr}`} />
            <div className={`${styles.logoline}`} />
            <div className={`${styles.close}`} onClick={onClose} />
            <div className={`${styles.inputcontainer}`}>
              <input
                type="text"
                placeholder="Type here"
                className={`${styles.input} ${
                  textError ? styles["shake-animation"] : ""
                }`}
                onChange={onChangeText}
                onKeyUp={handleOnKeyPress}
              />
            </div>
            <div className={`${styles.enter}`}>
              <button className={`${styles.btn}`} onClick={onClick}>
                submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRModal;
