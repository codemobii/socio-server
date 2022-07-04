const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("connection");

  socket.on("sendPostToServer", ([feed, user]) => {
    console.log([feed, user]);

    io.sockets.emit("sendPostToClient", [feed, user]);
    // socket.broadcast.emit('sendPostToClient', [feed, user]);
  });

  socket.on("disconnect", (socket) => {
    console.log("Disconnect");
  });
});

server.listen(3000, () => {
  console.log("Server is running");
});
