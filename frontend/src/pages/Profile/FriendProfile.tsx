import Header from "../../components/Header";
import ProfileCard from "./ProfileCard/PofileCard";
import MatchHistory from "./Match History/MatchHistory";
import styles from "./Profile.module.css";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../../hooks/socket/socket";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext, dmContext } from "../../App";

function Friendprofile(props: any) {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>();
  const [otherProfile, setOtherProfile] = useState<any>();
  const [login, setLogin] = useContext(LoginContext);
  const [dm, setDm] = useContext(dmContext);
  const navigate = useNavigate();
  useEffect(() => {
    socket.io.opts = {
      autoConnect: false,
      hostname: import.meta.env.VITE_HOSTNAME,
      path: "/socket.io",
      port: import.meta.env.VITE_PORT,
      query: { status: 2 },
      secure: false,
      withCredentials: true,
    };
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

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
    axios
      .get("http://" + import.meta.env.VITE_BACKEND + `/users/players/${id}`)
      .then((res) => {
        setOtherProfile(res.data);
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
                .then((res) => setOtherProfile(res.data));
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);

  async function handlerButton() {
    await setDm(true);
    navigate("/Chatting", {
      state: {
        flag: true,
        data: {
          userId: profile.id,
          userName: profile.name,
          targetId: id,
          targetName: otherProfile.name,
        },
      },
    });
  }

  return (
    <div className={`${styles.background}`}>
      <Header pageFlag={1} />
      <div className={`${styles.Allcontainer}`}>
        <ProfileCard id={id} />
        <MatchHistory id={id} />
      </div>
      <button className={`${styles.buttonone}`} onClick={handlerButton}>
        DM
      </button>
    </div>
  );
}

export default Friendprofile;
