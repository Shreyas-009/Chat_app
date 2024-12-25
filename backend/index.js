const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const mongoose = require("./config/mongoos");
const { chats } = require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRouts");
const { notFound, errorHandler } = require("./middleware/errormiddleware");
const path = require("path");

//cores used for giving access to frontend of ower databases
https: app.use(cors());

//the dqta came from fronted will be converted to json format
app.use(express.json());


// routes for user Login and Register
app.use("/api/user", userRoutes);
//
app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);


// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  // server working test
  app.get("/", (req, res) => {
    res.send("Server working ");
  });
}

// --------------------------deployment------------------------------



// Middleware for handling 404 Not Found errors
app.use(notFound);
// Middleware for handling general errors
app.use(errorHandler);

const server = app.listen(
  port,
  console.log(`Server is running on port ${port}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecived.sender._id) return;

      socket.in(user._id).emit("message recived", newMessageRecived);
    });
  });

  socket.on("delete message", ({ messageId, chatId }) => {
    socket.to(chatId).emit("message deleted", { messageId, chatId });
  });

});
