import { io } from "socket.io-client";

const SOCKET_URL=process.env.NEXT_PUBLIC_API_URL

export function initSocket({ token, onEvent }) {
  const socket = io(SOCKET_URL, {
    extraHeaders: {
      'Authorization': token,
    },
  });

  socket.on("connect", () => {
    console.log(socket.connected);
    onEvent('connected')
  });

  socket.on("disconnect", () => {
    console.log(socket.connected);
  });

  socket.on("priceChange", (data) => {
    console.log('priceChange')
    console.log(data);
    onEvent('priceChange', data)
  });

  socket.on("itemPurchased", (data) => {
    console.log('itemPurchased')
    console.log(data)
    onEvent('itemPurchased', data);
  });

  socket.on("itemSold", (data) => {
    console.log('itemSold')
    console.log(data);
    onEvent('itemSold', data);
  });

  return socket;
}
