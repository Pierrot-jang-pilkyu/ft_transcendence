import styles from "./InputModal.module.css";
import React from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../App";

function InputModal({ onOpenModal }) {
  const [textError, setTextError] = useState(false);
  const [login, setLogin] = useContext(LoginContext);

  const handleOpenQRModal = () => {
    onOpenModal();
  };

  const [text, setText] = useState("");

  function onChangeText(event) {
    setText(event.target.value);
  }

  const navigate = useNavigate();
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
          setTextError(false); // 400ms 후에 다시 false로 설정하여 흔들림 효과 제거
        }, 400);
      });
  }

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className={`${styles.popup_wrap}`}>
          <div className={`${styles.popup}`}>
            <div>
              <span className={`${styles.logo}`}>PIN 입력</span>
            </div>
            <div className={`${styles.logoline}`} />
            <div className={`${styles.inputcontainer}`}>
              <input
                type="text"
                placeholder="PIN번호 입력해주세요"
                className={`${styles.input} ${
                  textError ? styles["shake-animation"] : ""
                }`}
                onChange={onChangeText}
                onKeyUp={handleOnKeyPress}
              />
            </div>
            <div className={`${styles.enter}`}>
              <button className={`${styles.btn}`} onClick={onClick}>
                입력
              </button>
            </div>
            <div className={`${styles.qr}`}>
              <div className={`${styles.link}`} onClick={handleOpenQRModal}>
                QR code 등록
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default InputModal;
