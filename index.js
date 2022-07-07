const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 5000;

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "/app.html")));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
app.get("/", (req, res) => {
  res.json({
    message: "Socio Server is Running",
    time: new Date().toString(),
  });
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("sendPostToServer", ([feed, user]) => {
    console.log([feed, user]);

    io.sockets.emit("sendPostToClient", [feed, user]);
    // socket.broadcast.emit('sendPostToClient', [feed, user]);
  });

  socket.on("sendLikedPostToServer", ([likePost, likePostCount]) => {
    console.log([likePost, likePostCount]);

    socket.broadcast.emit("sendLikedPostToClient", [likePost, likePostCount]);
  });

  socket.on("sendCommentCountToServer", ([user_comment, commentCount]) => {
    console.log([user_comment, commentCount]);

    socket.broadcast.emit("sendCommentCountToClient", [
      user_comment,
      commentCount,
    ]);
  });

  socket.on("disconnect", (socket) => {
    console.log("Disconnect");
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
