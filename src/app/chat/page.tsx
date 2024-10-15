"use client";

import { useState, useRef } from "react";
import MainLoader from "../components/Loader/MainLoader";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import ChatButton from "../components/button/ChatButton";

const Chat = () => {
  const [startSession, setStartSession] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );

  const toggleSession = () => {
    if (startSession) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket manually disconnected");
        socketRef.current = null;
      }
    } else {
      socketRef.current = io("http://localhost:3001", {
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
      });

      socketRef.current.on("updateUsersCount", (count) => {
        setConnectedUsers(count);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server");
      });
    }
    setStartSession(!startSession);
  };

  return (
    <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-[#1c1c1c] text-white">
      <div className="h-[5vh] bg-[#26292e] flex border-b-2 border-[#37527a] p-2 gap-2">
        <p className="text-[#37527a]">Чат</p>
        <p>от NextChat.sosal</p>
      </div>
      <div className="max-h-[60%] flex flex-col justify-center">
        {startSession && connectedUsers < 2 ? (
          <div className="w-full my-[60px]">
            <MainLoader />
            <p className="text-center">Поиск собеседника...</p>
          </div>
        ) : null}
        {connectedUsers === 2 && startSession && (
          <div className="w-full my-[60px] flex flex-col justify-center items-center">
            <div>вывод сообщений</div>
            <div className="flex gap-2">
              <input type="text" className="w-full bg-slate-700" />
              <button>Отправить</button>
            </div>
          </div>
        )}
        {!startSession && (
          <ChatButton
            toggleSession={toggleSession}
            active={true}
            text="Начать Чат"
          />
        )}
        {startSession && connectedUsers !== 2 && (
          <ChatButton
            toggleSession={toggleSession}
            active={false}
            text="Остановить Поиск"
          />
        )}
        {startSession && connectedUsers === 2 && (
          <ChatButton
            toggleSession={toggleSession}
            active={false}
            text="Завершить Чат"
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
