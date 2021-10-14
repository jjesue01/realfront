import { io } from "socket.io-client";

const SOCKET_URL=process.env.NEXT_PUBLIC_API_URL

const socket = io(SOCKET_URL);

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

// socket.on("some-event", () => {
//   console.log(socket.id);
// });

// events: "priceChange", "itemPurchased", "itemSold"
