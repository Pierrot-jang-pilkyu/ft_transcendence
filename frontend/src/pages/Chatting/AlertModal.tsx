import styles from "./AlertModal.module.css";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EnterPW({ onClose, content }) {
  const [textError, setTextError] = useState(false);
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <div className={`${styles.popup_wrap}`}>
          <div className={`${styles.popup}`}>
            <div>
              <span className={`${styles.logo}`}>ERROR</span>
            </div>
            <div className={`${styles.logoline}`} />
            <div className={`${styles.close}`} onClick={onClose}></div>
            <div className={`${styles.content_font}`}>
              <pre>{content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EnterPW;
