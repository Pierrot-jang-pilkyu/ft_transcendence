import styles from "./ProfileCard.module.css";
import editprofile from "./Edit Profile.png";
import crown from "./crown.png";
import { useContext, useState, useEffect } from "react";
import { LoginContext, RenderContext } from "../../../App";
import axios from "axios";

function ProfileCard(props: any) {
  const [render, setRender] = useContext(RenderContext);
  const [profile, setProfile] = useState<any>();
  const [login, setLogin] = useContext(LoginContext);
  const [editFlag, setEditFlag] = useState(false);

  useEffect(() => {
    if (props.flag === 1) {
      setEditFlag(true);
    } else {
      setEditFlag(false);
    }
  }, [props.flag]);

  useEffect(() => {
    if (!props.id) {
      axios
        .get("http://" + import.meta.env.VITE_BACKEND + "/users/players/me")
        .then((res) => {
          setProfile(res.data);
        })
        .catch((error) => {
          if (error.res.data.message === "Unauthorized") {
            axios
              .get(
                "http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa"
              )
              .then(() => {
                axios
                  .get(
                    "http://" +
                      import.meta.env.VITE_BACKEND +
                      "/users/players/me"
                  )
                  .then((res) => setProfile(res.data));
              })
              .catch(() => {
                setLogin(false);
              });
          }
        });
    } else {
      axios
        .get(
          "http://" +
            import.meta.env.VITE_BACKEND +
            `/users/players/${props.id}`
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((error) => {
          if (error.res.data.message === "Unauthorized") {
            axios
              .get(
                "http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa"
              )
              .then(() => {
                axios
                  .get(
                    "http://" +
                      import.meta.env.VITE_BACKEND +
                      "/users/players/me"
                  )
                  .then((res) => setProfile(res.data));
              })
              .catch(() => {
                setLogin(false);
              });
          }
        });
    }
  }, [render]);

  return (
    <div className={`${styles.profile}`}>
      <div className={`${styles.profiletitle}`}>Profile</div>
      <div className={`${styles.profilebackground}`}>
        <img
          className={`${styles.photo}`}
          src={profile == undefined ? null : profile.avatar}
        />
        <div>
          <img
            className={styles.edit}
            src={editFlag ? editprofile : undefined}
            alt=""
            onClick={props.onOpenModal}
          />
        </div>
        <div className={`${styles.profilename}`}>
          {profile == undefined ? null : profile.name}
        </div>
        <div className={`${styles.rankpage}`}>
          <img src={crown} className={styles.crown} />
          <text className={`${styles.rank}`}>Rank:</text>
          <div className={`${styles.rankvalue}`}>
            {profile == undefined
              ? null
              : profile.gameRecord == null
              ? "--"
              : profile.gameRecord.rank}
          </div>
          <text className={`${styles.win}`}>Win:</text>
          <div className={`${styles.winvalue}`}>
            {/* {profile.gameRecord == undefined ? 0 : profile.gameRecord.win} */}
            {profile == undefined
              ? null
              : profile.gameRecord == null
              ? 0
              : profile.gameRecord.win}
          </div>
          <text className={`${styles.lose}`}>Lose:</text>
          <text className={`${styles.losevalue}`}>
            {profile == undefined
              ? null
              : profile.gameRecord == null
              ? 0
              : profile.gameRecord.loss}
          </text>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
