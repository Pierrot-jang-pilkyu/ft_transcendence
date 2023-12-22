import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { dmContext } from "../../../App";
import styles from "./Menu.module.css";
import GameStart from "../../../assets/GameStart.svg";
import ChattingRoom from "../../../assets/Chatting.svg";
import FriendsList from "./Friends/FriendsList";

function Menu() {
  const [dm, setDm] = useContext(dmContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<React.ReactNode | null>(null);
  const handlerButton = () => {
    navigate("/Game", { state: { invite: null } });
  };
  const handlerButtonChatting = () => {
    navigate("/Chatting");
    setDm(false);
    // navigate("/Chatting", { state: { flag: false }});
  };

  return (
    <div className={`${styles.container}`}>
      <button
        className={`${styles.button} ${styles.game}`}
        onClick={handlerButton}>
        <img className={styles.game_img} src={GameStart}></img>
        <div className={`${styles.game_font}`}>Start Game!</div>
      </button>
      <button
        id="Chatting_Room"
        className={`${styles.button} ${styles.chat}`}
        onClick={handlerButtonChatting}>
        <img src={ChattingRoom} />
        <div className={`${styles.chat_font}`}>Chatting Room</div>
      </button>
      <FriendsList />
      {alert}
    </div>
  );
}

export default Menu;
