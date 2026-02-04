import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL ?? "http://backend:3000";

export const socket: Socket = io(WS_URL, {
  withCredentials: true,
  transports: ["websocket"], 
  autoConnect: false,        // we decide when to connect
});
