import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";
import {
  isMatchConnecting,
  leaveWaitingRoom,
  disconnectSocket,
  connectingToWaitingRoom,
  isMatchingRoom,
} from "./utils/utils.mjs";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

app.use(cors());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

let rooms = {
  text: {},
  voice: {},
};

const users = [];
const voiceUsers = [];

const textNamespace = io.of("/chat");

textNamespace.on("connection", (socket) => {
  socket.on("set filters", (settings) => {
    const match = users.find((existingUser) => {
      return isMatchingRoom(existingUser.settings, settings);
    });

    let room;

    if (match) {
      isMatchConnecting(
        rooms,
        match,
        socket,
        room,
        "text",
        settings,
        textNamespace,
        users
      );
    } else {
      connectingToWaitingRoom(
        rooms,
        users,
        socket,
        textNamespace,
        settings,
        room,
        "text"
      );
    }

    socket.on("leave waiting room", () => {
      leaveWaitingRoom(socket, users);
    });

    socket.on("chat message", (msg) => {
      textNamespace
        .to(socket.room)
        .emit("chat message", { id: socket.id, message: msg });
    });

    socket.on("disconnect", () => {
      disconnectSocket(
        rooms,
        socket.room,
        socket.id,
        textNamespace,
        "text",
        false
      );
    });
  });
});

const voiceNamespace = io.of("/voice-chat");

voiceNamespace.on("connection", (socket) => {
  socket.on("set filters", (settings) => {
    const match = voiceUsers.find((existingUser) => {
      return isMatchingRoom(existingUser.settings, settings);
    });

    let room;

    if (match) {
      isMatchConnecting(
        rooms,
        match,
        socket,
        room,
        "voice",
        settings,
        voiceNamespace,
        voiceUsers
      );
    } else {
      connectingToWaitingRoom(
        rooms,
        voiceUsers,
        socket,
        voiceNamespace,
        settings,
        room,
        "voice"
      );
    }

    socket.on("leave waiting room", () => {
      leaveWaitingRoom(socket, voiceUsers);
    });

    socket.on("disconnect", () => {
      disconnectSocket(
        rooms,
        socket.room,
        socket.id,
        voiceNamespace,
        "voice",
        true
      );
    });
  });
});

httpServer.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
