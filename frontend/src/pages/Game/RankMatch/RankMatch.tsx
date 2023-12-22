import { useContext, useEffect, useState } from "react";
import { GameContext, GameModalContext, socket } from "../Utils";
import BorderButton from "../../../components/BorderButton/BorderButton";
import { useNavigate } from "react-router-dom";
import GameModal from "../GameModal/GameModal";
import styles from "./RankMatch.module.css";
import Timer from "../Timer/Timer";
import LoadingAnimation from "../../../components/LoadingAnimation/LoadingAnimation";
import { LoginContext } from "../../../App";
import { freshAxios, freshSocket } from "../../../Utils";

function RankMatch() {
  const [login, setLogin] = useContext<any>(LoginContext);
  const [game, setGame] = useContext<any>(GameContext);
  const [gameModal, setGameModal] = useContext<any>(GameModalContext);
  const [rate, setRate] = useState(null);
  const navigate = useNavigate();

  function clickMatch() {
    freshSocket(socket, "MATCH", {}, ()=>{setLogin(false)});
  }

  useEffect(() => {
    freshAxios({
        method: "get",
        url: "http://" + import.meta.env.VITE_BACKEND + "/users/game-records/me",
      },
      (res:any) => {setRate(res.data.rating)},
      () => {setLogin(false)}
    )

    socket.on("LOAD", (data) => {
      setGame(data);
      setGameModal({ open: close });
    });

    socket.on("PENALTY", (data) => {
      setGameModal({
        open: true,
        content: (
          <GameModal
            title={"닷지 패널티"}
            content={
              <Timer
                min={data.min}
                sec={data.sec}
                action={() => {
                  freshSocket(socket, "MATCH", {}, ()=>{setLogin(false)});
                }}
              />
            }
            leftButton={{
              title: "창닫기",
              onClick: () => {
                setGameModal({ open: false });
              },
            }}
          />
        ),
      });
    });

    socket.on("WAIT", ()=>{
      setGameModal({
        open: true,
        content: (
          <GameModal
            title={"매치 메이킹중"}
            content={<LoadingAnimation />}
            leftButton={{
              title: "취소",
              onClick: () => {
                socket.emit("CANCEL");
                setGameModal({ open: false });
              },
            }}
          />
        ),
      });
    })

    return () => {
      socket.off("LOAD");
      socket.off("PENALTY");
      socket.off("WAIT");
    };
  }, []);
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.title}`}>RATE: {rate}p</div>
      <BorderButton
        title={"MATCH START"}
        onClick={() => {
          clickMatch();
        }}
      />
      <BorderButton
        title={"BACK TO LOBBY"}
        onClick={() => {
          navigate("/Lobby");
        }}
      />
    </div>
  );
}

export default RankMatch;
