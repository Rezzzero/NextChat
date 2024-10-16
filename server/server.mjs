import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import { ExpressPeerServer } from "peer";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
  path: "/peerjs",
});

app.use("/peerjs", peerServer);

app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

let rooms = {
  text: {},
  voice: {},
};

const findRoom = (type) => {
  for (const room in rooms[type]) {
    if (rooms[type][room].length < 2) {
      return room;
    }
  }

  const newRoom = `${type}room${Object.keys(rooms).length + 1}`;
  rooms[type][newRoom] = [];
  return newRoom;
};

const textNamespace = io.of("/chat");

textNamespace.on("connection", (socket) => {
  console.log("a user connected");

  const room = findRoom("text");
  socket.join(room);
  rooms["text"][room].push(socket.id);
  console.log(`Пользователь ${socket.id} подключился к комнате ${room}`);

  textNamespace.to(room).emit("updateUsersCount", rooms["text"][room].length);

  if (rooms["text"][room].length === 2) {
    textNamespace.to(room).emit("chat ready");
  }

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    textNamespace
      .to(room)
      .emit("chat message", { id: socket.id, message: msg });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    rooms["text"][room] = rooms["text"][room].filter((id) => id !== socket.id);

    if (rooms["text"][room].length === 0) {
      delete rooms["text"][room];
      console.log(`Комната ${room} удалена`);
    } else {
      textNamespace
        .to(room)
        .emit("updateUsersCount", rooms["text"][room].length);

      if (rooms["text"][room].length < 2) {
        textNamespace.to(room).emit("chat not ready");
      }
    }
  });
});

const voiceNamespace = io.of("/voice-chat");

voiceNamespace.on("connection", (socket) => {
  console.log("a user connected to the voice chat");

  const room = findRoom("voice");
  socket.join(room);
  rooms["voice"][room].push(socket.id);
  console.log(`Пользователь ${socket.id} подключился к комнате ${room}`);

  voiceNamespace.to(room).emit("updateUsersCount", rooms["voice"][room].length);

  if (rooms["voice"][room].length === 2) {
    voiceNamespace.to(room).emit("chat ready");
  }

  socket.on("peer-id", (peerId) => {
    console.log(`Peer ID received: ${peerId}`);

    socket.to(room).emit("peer-id", peerId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected from voice chat");

    rooms["voice"][room] = rooms["voice"][room].filter(
      (id) => id !== socket.id
    );

    if (rooms["voice"][room].length === 0) {
      delete rooms["voice"][room];
      console.log(`Комната ${room} удалена`);
    } else {
      voiceNamespace
        .to(room)
        .emit("updateUsersCount", rooms["voice"][room].length);

      if (rooms["voice"][room].length < 2) {
        voiceNamespace.to(room).emit("voice chat not ready");
      }
    }
  });
});

httpServer.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
