const { Server } = require("socket.io");

let io;

const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
cors: {
      origin: [
        process.env.CLIENT_URL,
        "https://rentona-crm-gules.vercel.app",
        "https://rentona-crm-git-main-avikshit-s-projects.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.29.27:5173"
      ].filter(Boolean),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("join-room", (jobId) => {
      socket.join(`job_${jobId}`);
    });

    socket.on("send-message", (data) => {
      const { jobId, message, senderId, sender } = data;

      const payload = {
        jobId,
        message,
        senderId,
        sender,
        createdAt: new Date(),
      };

      io.to(`job_${jobId}`).emit("receive-message", payload);

      socket.broadcast.emit("chat-notification", payload);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const emitNotification = (userId, notification) => {
  const socketId = onlineUsers.get(userId);

  if (socketId && io) {
    io.to(socketId).emit("new-notification", notification);
  }
};

module.exports = {
  initSocket,
  emitNotification,
};