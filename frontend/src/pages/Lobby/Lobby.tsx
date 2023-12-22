import Header from "../../components/Header";
import styles from "./Lobby.module.css";
import Profile from "./Profile/Profile";
import Ranking from "./Ranking/Ranking";
import Menu from "./Menu/Menu";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../hooks/socket/socket";

function Lobby(props: any) {
  useEffect(() => {
    socket.io.opts = {
      autoConnect: false,
      hostname: import.meta.env.VITE_HOSTNAME,
      path: "/socket.io",
      port: import.meta.env.VITE_PORT,
      query: {status: 0},
      secure: false,
      withCredentials: true,
    }
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.background}`}>
      {/* <img className={`${styles.img}`} src={HomeBall}/> */}
      <Header pageFlag={1} />
      <Profile />
      <div className={`${styles.ranking_container}`}>
        <Ranking />
      </div>
      <div className={`${styles.menu_container}`}>
        <Menu />
      </div>
    </div>
  );
}

export default Lobby;
