import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "./token";

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (socket?.connected) {
    return socket;
  }

  const token = await getAccessToken();
  const baseUrl = process.env.EXPO_PUBLIC_BASEURL;

  if (socket) {
    socket.disconnect();
  }

  socket = io(baseUrl, {
    agent: "mobile",
    auth: { token },
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
