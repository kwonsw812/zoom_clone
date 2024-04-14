import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dirname } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (req, res) => res.render("home"));


const hadleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
    console.log(socket);
})

// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] == "Anon"
//     console.log("Connected to Browser");

//     socket.on("close", () => {
//         console.log("Disconnected from the Browser");
//     });

//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);

//         switch(message.type) {
//             case 'new_message':
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case 'nickname':
//                 socket["nickname"] = message.payload;
//         }
//     });
// });

httpServer.listen(3000, hadleListen);