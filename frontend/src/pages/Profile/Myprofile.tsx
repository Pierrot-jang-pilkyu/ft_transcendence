import Header from "../../components/Header";
import ProfileCard from "./ProfileCard/PofileCard";
import MatchHistory from "./Match History/MatchHistory";
import styles from "./Profile.module.css";
import { useEffect, useContext, useState } from "react";
import ChangeModal from "./ChangeModal/ChangeModal";
import socket from "../../hooks/socket/socket";

function Myprofile(props: any) {
  const [nickModal, setNickModal] = useState(false);

  useEffect(() => {

    socket.io.opts = {
      autoConnect: false,
      hostname: import.meta.env.VITE_HOSTNAME,
      path: "/socket.io",
      port: import.meta.env.VITE_PORT,
      query: {status: 1},
      secure: false,
      withCredentials: true,
    }

    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenChangeModal = () => {
    setNickModal(true);
  };
  const handleCloseChangeModal = () => {
    setNickModal(false);
  };

  return (
    <div className={`${styles.background}`}>
      <Header pageFlag={1} />
      <div className={`${styles.Allcontainer}`}>
        <ProfileCard onOpenModal={handleOpenChangeModal} flag={1} />
        <MatchHistory id={null} />
      </div>
      {nickModal && <ChangeModal onClose={handleCloseChangeModal} />}
    </div>
  );
}

export default Myprofile;
