import { io } from "socket.io-client";

const SOCKET_URL=process.env.NEXT_PUBLIC_API_URL

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  headers: {
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaWduZWRVc2VyIjp7Im5vdGlmaWNhdGlvbnMiOnsiYXVjdGlvbkV4cGlyYXRpb24iOmZhbHNlLCJiaWRBY3Rpdml0eSI6dHJ1ZSwiaXRlbVNvbGQiOnRydWUsIm5ld3NMZXR0ZXIiOmZhbHNlLCJvdXRiaWQiOnRydWUsIm93bmVkVXBkYXRlIjpmYWxzZSwicHJpY2VDaGFuZ2UiOmZhbHNlLCJyZWZlcnJhbFN1Y2Nlc3NmdWwiOmZhbHNlLCJzdWNjZXNzZnVsUHVyY2hhc2UiOmZhbHNlfSwiX2lkIjoiNjE2MDQzNjRjMTMyN2I1ZTczYzIzMTAxIiwid2FsbGV0QWRkcmVzcyI6IjB4Yjk0ZmE3NzhkY2MzYTQ3MTI4YzM4ODJmYzI3OTkxNDkzMzFjNzEyNiIsImNyZWF0ZWRBdCI6IjIwMjEtMTAtMDhUMTM6MTE6MDAuMzg2WiIsIl9fdiI6MTQsImxhc3RMb2dpbkF0IjoiMjAyMS0xMC0xNVQxNDo0MjoyNy4xNjZaIiwiYmlvIjoic2Rmc2RmZGRkZGQiLCJlbWFpbCI6IiIsInVzZXJuYW1lIjoiS29zdHlhIDIiLCJmYXZvcml0ZXMiOlsiNjE2MDQyM2VjMTMyN2I1ZTczYzIzMGUyIiwiNjE2MDhlZGQyNjgzMjJiNjhhYWQ4MzI5IiwiNjE2NmM1MWE3YzhjMGQwOTE1MGM2ZDAyIiwiNjE2NDNhNWI3YzhjMGQwOTE1MGM1YjQxIl0sImxvZ29JbWFnZSI6Imh0dHBzOi8vbmZ0LW1hcmtldC1kZXYuczMudXMtZWFzdC0yLmFtYXpvbmF3cy5jb20vbG9nb0ltYWdlXzE2MzM4Njk1Mjk1NTYucG5nIiwiYmFubmVySW1hZ2UiOiJodHRwczovL25mdC1tYXJrZXQtZGV2LnMzLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tL2Jhbm5lckltYWdlXzE2MzM4NjgyNDEyNDYuanBlZyJ9LCJpYXQiOjE2MzQzMDk2OTcsImV4cCI6MTYzNDM5NjA5N30.cG7vfTub5j2p76ajN_HYZXZX9nPN2_6jrFRDeQdc6YE',
  },
});

socket.on("connect", () => {
  console.log(socket.connected);
});

socket.on("disconnect", () => {
  console.log(socket.connected);
});

// socket.on("some-event", () => {
//   console.log(socket.id);
// });

// events: "priceChange", "itemPurchased", "itemSold"
