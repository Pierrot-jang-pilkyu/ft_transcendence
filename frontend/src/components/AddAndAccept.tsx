import { freshSocket } from "../Utils";
import styles from "./AddAndAccept.module.css";
import { useContext } from "react";
import { LoginContext } from "../App";

function AddAndAccept({ type, onClose, data, socket }) {
  const [Login, setLogin] = useContext(LoginContext);
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (type === "REQUEST_FRIEND") {
        handleFriendClose();
      } else if (type === "INVITE") {
        handleGameClose();
      }
    }
  };
  let modalContent;
  const handleFriendClose = () => {
    freshSocket(socket, "REFUSE_FRIEND", data, () => {
      setLogin(false);
    });
    onClose();
  };
  const handleFriendAccept = () => {
    freshSocket(socket, "ACCEPT_FRIEND", data, () => {
      setLogin(false);
    });
    onClose();
  };
  const handleGameClose = () => {
    freshSocket(socket, "REFUSE_GAME", data, () => {
      setLogin(false);
    });
    onClose();
  };
  const handleGameAccept = () => {
    freshSocket(socket, "ACCEPT_GAME", data, () => {
      setLogin(false);
    });
    onClose();
  };

  if (type === "REQUEST_FRIEND") {
    modalContent = (
      <div>
        <div className={`${styles.logo}`}>친구 초대요청</div>
        <div className={`${styles.logoline}`} />
        <div className={`${styles.avatar_container}`}>
          <img
            className={`${styles.avatar_image}`}
            src={data == undefined ? null : data.send.avatar}></img>
          <div className={`${styles.avatar_name}`}>{data.send.name}</div>
        </div>
        <div className={`${styles.button_container}`}>
          <button
            className={`${styles.button_close}`}
            onClick={handleFriendClose}>
            취소
          </button>
          <button
            className={`${styles.button_accept}`}
            onClick={handleFriendAccept}>
            친구 수락하기
          </button>
        </div>
      </div>
    );
  } else if (type === "INVITE") {
    modalContent = (
      <div>
        <div className={`${styles.logo}`}>게임 초대요청</div>
        <div className={`${styles.logoline}`} />
        <div className={`${styles.avatar_container}`}>
          <img
            className={`${styles.avatar_image}`}
            src={data == undefined ? null : data.send.avatar}></img>
          <div className={`${styles.avatar_name}`}>{data.send.name}</div>
        </div>
        <div className={`${styles.button_container}`}>
          <button
            className={`${styles.button_close}`}
            onClick={handleGameClose}>
            취소
          </button>
          <div className={`${styles.button_accept}`} onClick={handleGameAccept}>
            게임 수락하기
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`${styles.popup_wrap}`} onClick={handleOutsideClick}>
      <div className={`${styles.popup}`}>{modalContent}</div>
    </div>
  );
}

export default AddAndAccept;
