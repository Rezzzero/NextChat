import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import cors from "cors";

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

let rooms = {};

const findRoom = () => {
  for (const room in rooms) {
    if (rooms[room].length < 2) {
      return room;
    }
  }

  const newRoom = `room${Object.keys(rooms).length + 1}`;
  rooms[newRoom] = [];
  return newRoom;
};

io.on("connection", (socket) => {
  console.log("a user connected");

  const room = findRoom();
  socket.join(room);
  rooms[room].push(socket.id);
  console.log(`Пользователь ${socket.id} подключился к комнате ${room}`);

  io.to(room).emit("updateUsersCount", rooms[room].length);

  if (rooms[room].length === 2) {
    io.to(room).emit("chat ready");
  }

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.to(room).emit("chat message", { id: socket.id, message: msg });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    rooms[room] = rooms[room].filter((id) => id !== socket.id);

    if (rooms[room].length === 0) {
      delete rooms[room];
      console.log(`Комната ${room} удалена`);
    } else {
      io.to(room).emit("updateUsersCount", rooms[room].length);

      if (rooms[room].length < 2) {
        io.to(room).emit("chat not ready");
      }
    }
  });
});

httpServer.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
