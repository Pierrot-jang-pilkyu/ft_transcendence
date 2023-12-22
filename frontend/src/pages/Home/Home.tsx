import styles from "./Home.module.css";
import Button from "./Button_8px.js";
import Header from "./Header.js";
import HomeBall from "../../assets/HomeBall.png";
import QRModal from "../../components/QRModal.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputModal from "../../components/InputModal.js";
import axios from "axios";
let i = 0;

function Home() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [openQRModal, setToQRModal] = useState(false);
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    if (code && i === 0) {
      i++;
      axios.defaults.withCredentials = true;
      axios
        .post("http://" + import.meta.env.VITE_BACKEND + "/auth/login", {
          code: code,
        })
        .then((response) => {
          setShowQRModal(true);
        });
    }
  }, [showQRModal]);

  const handleOpenModal = () => {
    setShowQRModal(true);
  };

  const handleCloseModal = () => {
    setShowQRModal(false);
  };

  const handleToQrModal = () => {
    setToQRModal(true);
  };

  const handleClodeToQRModal = () => {
    setToQRModal(false);
  };

  return (
    <div className={`${styles.background}`}>
      <img className={`${styles.img}`} src={HomeBall} />
      <Header />
      <div className={`${styles.main}`}>
        <div className={`${styles.title}`}>Deer Feer</div>
        <div>
          <Button name="login" />
        </div>
      </div>
      {showQRModal && (
        <InputModal onClose={handleCloseModal} onOpenModal={handleToQrModal} />
      )}
      {openQRModal && <QRModal onClose={handleClodeToQRModal} />}
    </div>
  );
}

export default Home;
