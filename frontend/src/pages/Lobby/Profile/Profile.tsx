import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Crown from "../../../assets/Lobby_crown.png";
import axios from "axios";
import { LoginContext } from "../../../App";

function Profile(props: any) {
  const navigate = useNavigate();
  const [login, setLogin] = useContext(LoginContext);
  const handlerButton = () => {
    navigate("/MyProfile");
  };
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    axios
      .get("http://" + import.meta.env.VITE_BACKEND + "/users/players/me")
      .then((res) => setProfile(res.data))
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
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

  return (
    <div className={`${styles.profile_container}`}>
      {/* <div className={`${styles.profile_img}`}></div> */}
      <img
        className={`${styles.profile_img}`}
        src={profile == undefined ? null : profile.avatar}
      />
      <div className={`${styles.profile_second}`}>
        <div className={`${styles.profile_name}`}>
          {profile == undefined ? null : profile.name}
        </div>
        <div className={`${styles.profile_win}`}>Win:</div>
        <div className={`${styles.profile_win_value}`}>
          {profile == undefined
            ? null
            : profile.gameRecord == null
            ? 0
            : profile.gameRecord.win}
        </div>
        <div className={`${styles.profile_lose}`}>Lose:</div>
        <div className={`${styles.profile_lose_value}`}>
          {profile == undefined
            ? null
            : profile.gameRecord == null
            ? 0
            : profile.gameRecord.loss}
        </div>
      </div>
      <div className={`${styles.profile_line}`}></div>
      <img className={`${styles.profile_crown}`} src={Crown} />
      <div className={`${styles.profile_rank}`}>Rank:</div>
      <div className={`${styles.profile_rank_value}`}>
        {profile == undefined
          ? null
          : profile.gameRecord == null
          ? "--"
          : profile.gameRecord.rank}
      </div>
      <button className={styles.button} onClick={handlerButton}></button>
    </div>
  );
}

export default Profile;
