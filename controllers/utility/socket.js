import { Server } from "socket.io";

let io;
const users = new Map(); // Simpan NIK -> SocketID

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    socket.on("register", (nik) => {
      users.set(nik, socket.id);
      console.log(`User ${nik} terhubung.`);
    });

    socket.on("disconnect", () => {
      // Hapus dari map saat logout/putus
      for (let [nik, id] of users.entries()) {
        if (id === socket.id) users.delete(nik);
      }
    });
  });
};

export const sendToUser = (nik, event, data) => {
  const socketId = users.get(nik);
  if (socketId) {
    io.to(socketId).emit(event, data);
    return true;
  }
  return false; // User sedang offline
};