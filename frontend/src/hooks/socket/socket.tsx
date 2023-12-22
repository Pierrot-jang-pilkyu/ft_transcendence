import { io } from "socket.io-client";

// const socket = io("localhost:3131/lobby", {
//   autoConnect: false,
// });

const socket = io("http://" + import.meta.env.VITE_SOCKET + "/lobby", {
  autoConnect: false,
  withCredentials: true,
});
export default socket;
