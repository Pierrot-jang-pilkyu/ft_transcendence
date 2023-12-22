import styles from "./ChangeModal.module.css";
import socket from "../../../hooks/socket/socket";
import { useState, useEffect, ChangeEvent, useContext } from "react";
import { LoginContext } from "../../../App";
import axios from "axios";
import { freshSocket } from "../../../Utils";

function ChangeModal({ onClose }) {
  const [login, setLogin] = useContext(LoginContext);
  const [profile, setProfile] = useState();
  const [image, setImage] = useState(undefined as string | undefined);
  const [userName, setUserName] = useState<string | undefined>(profile?.name);
  const [originalImage, setOriginalImage] = useState<string | undefined>(
    profile?.avatar
  );
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("http://" + import.meta.env.VITE_BACKEND + "/users/players/me")
        .then((res) => {
          setProfile(res.data);
          setOriginalImage(res.data.avatar);
        })
        .catch((error) => {
          if (error.response.data.message === "Unauthorized") {
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
                  .then((res) => {
                    setProfile(res.data);
                    setOriginalImage(res.data.avatar);
                    setUserName(res.data.name);
                  });
              })
              .catch(() => {
                setLogin(false);
              });
          }
          console.error("데이터를 가져오는 중 오류 발생:", error);
        });
    };
    fetchData();
  }, []);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const fileResult = reader.result as string;
          setImage(fileResult);
        } else {
          console.error("Error: Failed to read file.");
        }
      };
      reader.onerror = (error) => {
        console.error("Error", error);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleConfirm = () => {
    const selectedImage: string = image || originalImage || "";
    sendToServer(selectedImage, userName);
    onClose();
  };

  const sendToServer = (imageUrl: string, username: string) => {
    if (typeof username === "undefined") username = profile.name;
    freshSocket(socket, "UPDATE", { name: username, avatar: imageUrl }, () => {
      setLogin(false);
    });
  };
  function onChangeName(e) {
    console.log(userName);
    setUserName(e.target.value);
  }

  return (
    <div className={`${styles.popup_wrap}`} onClick={handleOutsideClick}>
      <div className={`${styles.popup}`}>
        <div className={`${styles.logo}`}>프로필 정보 변경</div>
        <div className={`${styles.logoline}`} />
        <div className={`${styles.avatar_container}`}>
          <div className="grid w-full max-w-xs items-center gap-1.5">
            <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Choose Avatar
            </label>
            <input
              id="picture"
              type="file"
              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              onChange={handleFileChange}
            />
          </div>
          <div className={`${styles.form__group}`}>
            <input
              type="input"
              className={`${styles.form__field}`}
              placeholder={profile == undefined ? null : profile.name}
              onChange={onChangeName}
            />
            <label className={`${styles.form__label}`}>Name</label>
          </div>
        </div>
        <div className={`${styles.button_container}`}>
          <button className={`${styles.button_close}`} onClick={handleClose}>
            닫기
          </button>
          <button className={`${styles.button_accept}`} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeModal;
