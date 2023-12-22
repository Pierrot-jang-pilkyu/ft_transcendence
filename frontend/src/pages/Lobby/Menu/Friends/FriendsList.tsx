import styles from "./FriendsList.module.css";
import Avatar from "./Avatar";
import { useState, useEffect, useContext, KeyboardEvent } from "react";
import SearchFriends from "../../../../assets/SearchFriends.svg";
import FriendsArrow from "../../../../assets/FriendsArrow.svg";
import FriendsAdd from "../../../../assets/FriendsAdd.svg";
import axios from "axios";
import socket from "../../../../hooks/socket/socket";
import { LoginContext } from "../../../../App";
import icon from "../../../../assets/alert.svg";
import { freshSocket } from "../../../../Utils";

interface Friend {
  name: string;
  img: string;
  state: string;
  id: string;
}

let userId: number = 0;

function FriendsList() {
  const [login, setLogin] = useContext(LoginContext);
  const [nick, setNick] = useState("");
  const [fList, setFList] = useState<any>([]);
  const [alert, setAlert] = useState<React.ReactNode | null>(undefined);
  const [alertFlag, setAlertFlag] = useState(false);
  const friendsList: Friend[] = [];

  const changeAvatar = () => {
    const res: any = [];

    for (let i = 0; i < friendsList.length; ++i) {
      res.push(
        <li>
          <Avatar
            name={friendsList[i].name}
            img={friendsList[i].img}
            state={friendsList[i].state}
            id={friendsList[i].id}
          />
        </li>
      );
    }

    return res;
  };

  useEffect(() => {
    function onInfoFriends(responseData: any) {
      friendsList.splice(0, friendsList.length);

      for (let i = 0; i < responseData.length; ++i) {
        friendsList.push({
          name: responseData[i].friend.name,
          img: responseData[i].friend.avatar,
          state: responseData[i].friend.status,
          id: responseData[i].friend.id,
        });
      }

      setFList(changeAvatar());
    }
    const handleNotice = (data) => {
      switch (data.code) {
        case 30:
          setAlert(
            <div
              role="alert"
              className={`${styles.alert} ${styles.alert_error}`}>
              <div className={`${styles.error_icon}`}>
                <img src={icon}></img>
              </div>
              <span>이미 친구 입니다!</span>
            </div>
          );
          setAlertFlag(true);
          setTimeout(() => {
            setAlertFlag(false);
          }, 5000);
          break;
        case 29:
          setAlert(
            <div
              role="alert"
              className={`${styles.alert} ${styles.alert_error}`}>
              <div className={`${styles.error_icon}`}>
                <img src={icon}></img>
              </div>
              <span>이미 친구 요청을 전송했습니다!</span>
            </div>
          );
          setAlertFlag(true);
          setTimeout(() => {
            setAlertFlag(false);
          }, 5000);
          break;
        case 11:
          setAlert(
            <div
              role="alert"
              className={`${styles.alert} ${styles.alert_error}`}>
              <div className={`${styles.error_icon}`}>
                <img src={icon}></img>
              </div>
              <span>존재하지 않는 유저입니다!</span>
            </div>
          );
          setAlertFlag(true);
          setTimeout(() => {
            setAlertFlag(false);
          }, 5000);
          break;
      }
    };
    socket.on("NOTICE", (data) => handleNotice(data));
    socket.on("INFO_FRIENDS", onInfoFriends);

    return () => {
      socket.off("INFO_FRIENDS", onInfoFriends);
    };
  }, []);

  function freshAxios(axObj: any, resFunc: any, errFunc: any) {
    axios(axObj)
      .then((res) => {
        resFunc(res);
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthorized") {
          axios
            .get(
              "http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/login"
            )
            .then(() => {
              axios(axObj)
                .then((res) => {
                  resFunc(res);
                })
                .catch(() => {
                  errFunc();
                });
            })
            .catch(() => {
              errFunc();
            });
        }
      });
  }

  useEffect(() => {
    function getUserRes(Response: any) {
      userId = parseInt(Response.data.id);
    }

    freshAxios(
      "http://" + import.meta.env.VITE_BACKEND + "/users/players/me",
      getUserRes,
      () => {
        setLogin(false);
      }
    );

    axios
      .get("http://" + import.meta.env.VITE_BACKEND + "/users/friends/me")
      .then((Response) => {
        for (let i = 0; i < Response.data.length; ++i) {
          friendsList.push({
            name: Response.data[i].friend.name,
            img: Response.data[i].friend.avatar,
            state: Response.data[i].friend.status,
            id: Response.data[i].friend.id,
          });
        }
        setFList(changeAvatar());
      })
      .catch((Error) => {
        if (Error.response.data.message === "Unauthorized") {
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then(() => {
              axios
                .get(
                  "http://" + import.meta.env.VITE_BACKEND + "/users/friends/me"
                )
                .then((Response) => {
                  for (let i = 0; i < Response.data.length; ++i) {
                    friendsList.push({
                      name: Response.data[i].friend.name,
                      img: Response.data[i].friend.avatar,
                      state: Response.data[i].friend.status,
                      id: Response.data[i].friend.id,
                    });
                  }
                  setFList(changeAvatar());
                });
            })
            .catch(() => {
              setLogin(false);
            });
        }
      });
  }, []);

  const onChange = (e: any) => {
    setNick(e.target.value);
  };

  const onAddButton = () => {
    setNick("");
    if (nick === "") {
      return "";
    }

    freshSocket(
      socket,
      "REQUEST_FRIEND",
      { userId: userId, target: nick },
      () => {
        setLogin(false);
      }
    );
  };

  const activeEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
      onAddButton();
    }
  };

  return (
    <div className={`${styles.drawer} ${styles["drawer-end"]}`}>
      <input
        id="my-drawer-4"
        type="checkbox"
        className={`${styles["drawer-toggle"]}`}
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-4"
          className={`${styles.button} ${styles.friend} ${styles.friend_font}`}>
          <img className={styles.friend_img} src={SearchFriends}></img>
          <div className={`${styles.friend_font}`}>Search Friends</div>
          <img src={FriendsArrow}></img>
        </label>
      </div>
      <div className={`${styles["drawer-side"]}`}>
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className={`${styles["drawer-overlay"]}`}></label>
        <div className={styles.fl_background}>
          <div className={styles.friend_list}>
            <ul className="menu p-4 w-80 min-h-full bg-gray-200 text-base-content">
              {/* Sidebar content here */}
              {fList}
            </ul>
          </div>
          <div className={`${styles.input_container}`}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Search…"
                className={`${styles.input}`}
                value={nick}
                onChange={onChange}
                onKeyDown={activeEnter}
              />
              <img
                className={styles.add_container}
                src={FriendsAdd}
                onClick={onAddButton}></img>
            </div>
          </div>
          {alertFlag && alert}
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
