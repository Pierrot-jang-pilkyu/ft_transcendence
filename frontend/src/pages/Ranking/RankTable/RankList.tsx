import { useNavigate } from "react-router-dom";
import styles from "./RankList.module.css";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "../../../App";

function RankList(props: any) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>();
  const [login, setLogin] = useContext(LoginContext);
  useEffect(() => {
    axios

      .get("http://" + import.meta.env.VITE_BACKEND + "/users/players/me")
      .then((res) => {
        setProfile(res.data);
      })
      .catch((error) => {
        if (error.res.data.message === "Unauthorized") {
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() => {
              axios
                .get(
                  "http://" + import.meta.env.VITE_BACKEND + "/users/players/me"
                )
                .then((res) => setProfile(res.data));
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);
  const handlerButton = () => {
    if (props.id === profile.id) navigate(`/MyProfile`);
    else {
      navigate(`/FriendProfile/${props.id}`);
    }
  };
  return (
    <div className={`${styles.listcontainer}`}>
      <text className={`${styles.listnum}`}>{props.rank}</text>
      <div className={`${styles.listnick}`} onClick={handlerButton}>
        {props.nickname}
      </div>
      <text className={`${styles.point}`}>{props.score}</text>
    </div>
  );
}

export default RankList;
