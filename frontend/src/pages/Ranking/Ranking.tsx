import styles from "./Ranking.module.css";
import ProfileCard from "../Profile/ProfileCard/PofileCard";
import Header from "../../components/Header";
import RankTable from "./RankTable/RankTable";
import { useNavigate } from "react-router-dom";
import { IdContext } from "../../App";
import { useContext, useEffect } from "react";
import socket from "../../hooks/socket/socket";

function Ranking(props: any) {
  useEffect(() => {
    socket.io.opts = {
      autoConnect: false,
      hostname: import.meta.env.VITE_HOSTNAME,
      path: "/socket.io",
      port: import.meta.env.VITE_PORT,
      query: {status: 3},
      secure: false,
      withCredentials: true,
    }
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const navigate = useNavigate();

  const handlerButton = () => {
    navigate("/MyProfile");
  };

  return (
    <div className={`${styles.background}`}>
      <Header pageFlag={1} />
      <div className={`${styles.Allcontainer}`}>
        <ProfileCard />
        <RankTable />
      </div>
      <button className={`${styles.buttonone}`} onClick={handlerButton}>
        Match History
      </button>
    </div>
  );
}

export default Ranking;
