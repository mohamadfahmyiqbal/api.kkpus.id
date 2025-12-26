import { Server } from "socket.io";

let io = null;

// Map: nik -> socketId
const users = new Map();

/**
 * Init Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "https://kkpus.id",
        "https://admin.kkpus.id",
        "https://api.kkpus.id",
        "https://localhost:5000",
        "https://localhost:5001",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /**
     * Register user
     * client emit: socket.emit("register", nik)
     */
    socket.on("register", (nik) => {
      if (!nik) return;
      users.set(nik, socket.id);
      console.log(`👤 User ${nik} registered (${socket.id})`);
    });

    socket.on("disconnect", () => {
      for (const [nik, id] of users.entries()) {
        if (id === socket.id) {
          users.delete(nik);
          console.log(`❌ User ${nik} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

/**
 * Emit event ke user tertentu
 */
export const sendToUser = (nik, event, data) => {
  if (!io) {
    console.warn("⚠️ Socket.IO belum diinisialisasi");
    return false;
  }

  const socketId = users.get(nik);
  if (!socketId) return false;

  io.to(socketId).emit(event, data);
  return true;
};
