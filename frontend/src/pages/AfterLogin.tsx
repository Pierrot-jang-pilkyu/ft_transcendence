import React, { useEffect, useState, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import FriendProfile from "./Profile/FriendProfile";
import Myprofile from "./Profile/Myprofile";
import Lobby from "./Lobby/Lobby";
import Chatting from "./Chatting/Chatting";
import Ranking from "./Ranking/Ranking";
import Game from "./Game/Game";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../hooks/socket/socket";
import ModalAccept from "../components/AddAndAccept";
import axios from "axios";
import { LoginContext, RenderContext } from "../App";
import Loading from "./Loading/Loading";

function AfterLogin() {
  const navigate = useNavigate();
  const [render, setRender] = useContext(RenderContext);
  const [login, setLogin] = useContext(LoginContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    const handleFriendRequest = (data) => {
      setModalContent(
        <ModalAccept
          type={"REQUEST_FRIEND"}
          data={data}
          onClose={() => setModalOpen(false)}
          socket={socket}
        />
      );
      setModalOpen(true);
    };
    const handleGameRequest = (data) => {
      setModalContent(
        <ModalAccept
          type={"INVITE"}
          data={data}
          onClose={() => setModalOpen(false)}
          socket={socket}
        />
      );
      setModalOpen(true);
    };
    function onJoinGame(responseData: any) {
      navigate("/Game", {
        state: {
          invite: {
            roomId: responseData.roomId,
            gameRequest: responseData.gameRequest,
          },
        },
      });
    }
    const handleNotice = (data) => {
      switch (data.code) {
        case 201:
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
                    "http://" +
                      import.meta.env.VITE_BACKEND +
                      "/auth/refresh/login"
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
          break;
        case 202:
          axios
            .get("http://" + import.meta.env.VITE_BACKEND + "/auth/refresh/2fa")
            .then((res) => {
              setRender((prev) => !prev);
            })
            .catch(() => {
              setLogin(false);
            });
          break;
      }

      return () => {
        socket.off("NOTICE");
      };
    };
    socket.on("NOTICE", (data) => handleNotice(data));

    socket.on("REQUEST_FRIEND", (data) => handleFriendRequest(data));
    socket.on("INVITE", (data) => handleGameRequest(data));
    // join game
    socket.on("JOIN_GAME", onJoinGame);
  }, [socket]);
  return (
    <div>
      <Routes>
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/Loading" element={<Loading />} />
        <Route path="/MyProfile" element={<Myprofile />} />
        <Route path="/FriendProfile/:id" element={<FriendProfile />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/Chatting" element={<Chatting />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="*" element={<Lobby />} />
      </Routes>
      {modalOpen && modalContent}
    </div>
  );
}

export default AfterLogin;
