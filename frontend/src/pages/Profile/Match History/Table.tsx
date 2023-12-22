import styles from "./Table.module.css";
import List from "./List";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../App";

interface History {
  winflag: boolean;
  matchtime: string;
  name: string;
}

function HistoryTable(props: any) {
  const [login, setLogin] = useContext(LoginContext);
  const [history, setHistory] = useState<History[]>([]);
  let HistoryList: History[] = [];
  useEffect(() => {
    let url: any;
    if (props.id === null) {
      url = "http://" + import.meta.env.VITE_BACKEND + "/games/historys/me";
    } else {
      url =
        "http://" +
        import.meta.env.VITE_BACKEND +
        `/games/historys/${props.id}`;
    }
    axios
      .get(url)
      .then((Response) => {
        for (let i = 0; i < Response.data.length; ++i) {
          {
            Response.data[i] &&
              HistoryList.push({
                winflag: Response.data[i].result,
                matchtime: Response.data[i].date,
                name: Response.data[i].opponent.name,
              });
          }
        }
        setHistory(HistoryList);
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() => {
              axios.get(url).then((Response) => {
                for (let i = 0; i < Response.data.length; ++i) {
                  {
                    Response.data[i] &&
                      HistoryList.push({
                        winflag: Response.data[i].result,
                        matchtime: Response.data[i].date,
                        name: Response.data[i].opponent.name,
                      });
                  }
                }
                setHistory(HistoryList);
              });
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);

  return (
    <div className={`${styles.background}`}>
      <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
        <ul>
          {history.map((item, index) => (
            <List
              key={index}
              winflag={item.winflag}
              matchtime={item.matchtime}
              name={item.name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HistoryTable;
