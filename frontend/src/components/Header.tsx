import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import FriendsRequest from "./FriendsRequest";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../App";
import axios from "axios";

function Header({ pageFlag }: { pageFlag: number }) {
  const [login, setLogin] = useContext(LoginContext);
  const navigate = useNavigate();
  const handlerButton = () => {
    navigate("/Lobby");
  };
  const handlerButtonLogOut = () => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://" + import.meta.env.VITE_BACKEND + "/auth/logout")
      .then((response) => {
        setLogin(false);
        navigate("/");
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios
            .get(
              "http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/login"
            )
            .then((response) => {
              axios.post(
                "http://" + import.meta.env.VITE_BACKEND + "/auth/logout"
              );
              setLogin(false);
              navigate("/");
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  };
  return (
    <header className={`${styles.header}`}>
      <button
        className={`${styles.home} ${styles.button}`}
        onClick={handlerButton}
      >
        Deer Feer
      </button>
      {login == true && (
        <div className={`${styles.list}`}>
          <FriendsRequest pageFlag={pageFlag} />
        </div>
      )}
      {login == true && (
        <button
          className={`${styles.logout} ${styles.button}`}
          onClick={handlerButtonLogOut}
        >
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;
