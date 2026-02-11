const { Server } = require("socket.io");

let io;
const userSockets = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      userSockets.set(userId, socket.id);
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("updateLocation", (data) => {
      const { userId, role, lat, lng, bookingId, targetId } = data;
      if (targetId) {
        io.to(`user_${targetId}`).emit("locationUpdated", {
          userId,
          role,
          lat,
          lng,
          bookingId,
        });
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log("User disconnected");
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { initSocket, getIO };
