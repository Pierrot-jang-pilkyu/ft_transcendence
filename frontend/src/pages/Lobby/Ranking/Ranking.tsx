import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import styles from "./Ranking.module.css";
import UserRanking from "./UserRanking";
import Stroke from "../../../assets/Ranking_Vector(Stroke).png";
import axios from "axios";
import { LoginContext } from "../../../App";

function Ranking(props: any) {
  const navigate = useNavigate();
  const [login, setLogin] = useContext(LoginContext);
  const handlerButton = () => {
    navigate("/Ranking");
  };

  const [ranks, setRanks] = useState();

  useEffect(() => {
    axios
      .get("http://" + import.meta.env.VITE_BACKEND + "/games/ranks")
      .then((res) => setRanks(res.data))
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() => {
              axios
                .get("http://" + import.meta.env.VITE_BACKEND + "/games/ranks")
                .then((res) => setRanks(res.data));
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);

  const rankerTable1 = () => {
    const res: any = [];
    if (ranks == undefined) return res;
    for (let i = 0; i < 5; ++i) {
      if (ranks[i] == undefined)
        res.push(
          <UserRanking rank={null} nickname={null} win={null} lose={null} />
        );
      else {
        const score: string = ranks[i].rating + "P";
        res.push(
          <UserRanking
            rank={i + 1}
            nickname={ranks[i].user.name}
            score={score}
          />
        );
      }
    }
    return res;
  };

  const rankerTable2 = () => {
    const res = [];
    if (ranks == undefined) return res;
    for (let i = 5; i < 10; ++i) {
      if (ranks[i] == undefined)
        res.push(
          <UserRanking rank={null} nickname={null} win={null} lose={null} />
        );
      else {
        const score: string = ranks[i].rating + "P";
        res.push(
          <UserRanking
            rank={i + 1}
            nickname={ranks[i].user.name}
            score={score}
          />
        );
      }
    }
    return res;
  };

  return (
    <div className={`${styles.ranking_table}`}>
      <div className={`${styles.ranking_top10}`}>Ranking Top 10</div>
      <div className={`${styles.ranking_table_line}`}></div>
      <div className={`${styles.ranking_table_small}`}>{rankerTable1()}</div>
      <div className={`${styles.ranking_table_small_2}`}>{rankerTable2()}</div>
      <button className={styles.ranking_view_more} onClick={handlerButton}>
        View More
      </button>
      <img className={`${styles.ranking_view_more_img}`} src={Stroke} />
    </div>
  );
}

export default Ranking;
