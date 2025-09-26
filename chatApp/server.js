const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const authMiddleware = require("./middlewares/auth");
const notificationRoute = require("./notification/register-for-notification");
const sendPushNotification = require("./notification/send-broadcast");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/register-for-notification", notificationRoute);
app.use("/send-broadcast", sendPushNotification);
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);
app.use("/upload", authMiddleware, uploadRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Online users
const onlineUsers = new Map();

db.sequelize.sync().then(() => console.log("Database synced"));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));
  try {
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.userId}`);
  onlineUsers.set(socket.userId, socket.id);
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  socket.on("joinRoom", ({ roomId }) => socket.join(roomId));

  socket.on("typing", ({ roomId, isTyping }) => {
    socket.to(roomId).emit("typing", { from: socket.userId, isTyping });
  });

  socket.on("message", async ({ from, to, text, media, roomId }) => {
    const message = await db.Message.create({ from, to, text, media });
    if (roomId) io.to(roomId).emit("message", message);
    else if (onlineUsers.has(to)) io.to(onlineUsers.get(to)).emit("message", message);
  });

  socket.on("seen", async ({ messageId }) => {
    const [_, updated] = await db.Message.update(
      { status: "seen" },
      { where: { id: messageId }, returning: true }
    );
    io.emit("seen", { message: updated[0] });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.userId);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

server.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));


///===========