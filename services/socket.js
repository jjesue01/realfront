import { io } from "socket.io-client";

const SOCKET_URL='https://server-domain.com'

const socket = io(SOCKET_URL);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

socket.on("some-event", () => {
  console.log(socket.id);
});
