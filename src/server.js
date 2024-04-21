import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { instrument } from "@socket.io/admin-ui";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const hadleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });

  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });

  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });

  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

// function publicRooms() {
//   const {
//     sockets: {
//       adapter: { sids, rooms },
//     },
//   } = wsServer;
//   const publicRooms = [];

//   rooms.forEach((_, key) => {
//     if (sids.get(key) === undefined) {
//       publicRooms.push(key);
//     }
//   });

//   return publicRooms;
// }

// function countRoom(roomName) {
//   return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }

// wsServer.on("connection", (socket) => {
//   socket["nickname"] = "anonymous";

//   socket.onAny((event) => {
//     console.log(wsServer.sockets.adapter);
//     console.log(`Socket Event: ${event}`);
//   });

//   socket.on("enter_room", (roomName, done) => {
//     socket.join(roomName);
//     done();
//     socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));

//     wsServer.sockets.emit("room_change", publicRooms());
//   });

//   socket.on("disconnecting", () => {
//     socket.rooms.forEach((room) =>
//       socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
//     );
//   });

//   socket.on("disconnect", () => {
//     wsServer.sockets.emit("room_change", publicRooms());
//   });

//   socket.on("new_message", (msg, room, done) => {
//     socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//     done();
//   });

//   socket.on("nickname", (nickname) => {
//     socket["nickname"] = nickname;
//   });
// });

httpServer.listen(3000, hadleListen);
