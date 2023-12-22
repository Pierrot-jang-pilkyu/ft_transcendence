import styles from "./RoomAddModal.module.css";
import React from "react";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoomAddModal({ onClose, roomAdd, id }) {
  const [textError, setTextError] = useState(false);
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    
  }, []);

  const [name, setName] = useState("");
  const [limits, setLimits] = useState<string>("");
  const [pw, setPw] = useState("");

  function onChangeName(event) {
    setName(event.target.value);
  }

  function onChangeLimits(event) {
    setLimits(event.target.value);
  }

  function onChangePw(event) {
    setPw(event.target.value);
  }

  const navigate = useNavigate();

  function onClick() {
    if (!(2 <= parseInt(limits) && parseInt(limits) <= 10))
    {
      setTextError(true);
      setTimeout(() => {
        setTextError(false); // 400ms 후에 다시 false로 설정하여 흔들림 효과 제거
      }, 400);
    }

    roomAdd(name, limits, pw);
  }

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <div className={`${styles.popup_wrap}`}>
          <div className={`${styles.popup}`}>
            <div>
              <span className={`${styles.logo}`}>방 생성</span>
            </div>
            <div className={`${styles.logoline}`} />
            <img className={`${styles.close}`} src="./src/assets/Modal_cancle.png" onClick={onClose}/>
            <div className={`${styles.inputcontainer_name}`}>
              <input
                type="text"
                placeholder="방이름을 입력해주세요. (30자 미만)"
                className={`${styles.input} ${
                  textError ? styles["shake-animation"] : ""
                }`}
                onChange={onChangeName}
                onKeyUp={handleOnKeyPress}
              />
            </div>
            <div className={`${styles.inputcontainer_limits}`}>
              <input
                type="text"
                placeholder="인원제한(2-10)을 입력해주세요."
                className={`${styles.input} ${
                  textError ? styles["shake-animation"] : ""
                }`}
                onChange={onChangeLimits}
                onKeyUp={handleOnKeyPress}
              />
            </div>
            <div className={`${styles.inputcontainer_pw}`}>
              <input
                type="text"
                placeholder="비밀번호를 입력해주세요."
                className={`${styles.input} ${
                  textError ? styles["shake-animation"] : ""
                }`}
                onChange={onChangePw}
                onKeyUp={handleOnKeyPress}
              />
            </div>
            <div className={`${styles.enter}`}>
              <button className={`${styles.btn}`} onClick={onClick}>
                생성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RoomAddModal;
