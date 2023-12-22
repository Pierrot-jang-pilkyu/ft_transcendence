import styles from "./RankTable.module.css";
import RankList from "./RankList";
import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../../../App";
import axios from "axios";

function RankTable(props: any) {
  const [ranks, setRanks] = useState<any>();
  const [login, setLogin] = useContext(LoginContext);

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
    for (let i = 0; i < 16; ++i) {
      if (ranks[i] == undefined)
        res.push(
          <RankList rank={null} nickname={null} win={null} lose={null} />
        );
      else {
        const score: string = ranks[i].rating + "P";
        const id: number = ranks[i].user.id;
        res.push(
          <RankList
            rank={i + 1}
            nickname={ranks[i].user.name}
            score={score}
            id={id}
          />
        );
      }
    }
    return res;
  };

  return (
    <div className={`${styles.rankcontainer}`}>
      <div className={`${styles.ranktitle}`}>Rank</div>
      <div className={`${styles.rankbackground}`}>{rankerTable1()}</div>
    </div>
  );
}

export default RankTable;
