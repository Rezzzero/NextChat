"use client";

import { useState, useRef } from "react";
import MainLoader from "../components/Loader/MainLoader";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import ChatButton from "../components/button/ChatButton";

const Chat = () => {
  const [startSession, setStartSession] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; message: string }[]
  >([]);
  const [chatReady, setChatReady] = useState(false);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );

  const toggleSession = () => {
    if (startSession) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket manually disconnected");
        socketRef.current = null;
        setChatMessages([]);
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

      socketRef.current.on("chat ready", () => {
        setChatReady(true);
      });

      socketRef.current.on("chat not ready", () => {
        setChatReady(false);
        setChatMessages([]);
      });

      socketRef.current.on("disconnect", () => {
        setChatReady(false);
      });

      socketRef.current.on(
        "chat message",
        (msg: { id: string; message: string }) => {
          setChatMessages((prevMessages) => [...prevMessages, msg]);
        }
      );
    }
    setStartSession(!startSession);
  };

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-[#1c1c1c] text-white">
      <div className="h-[5vh] bg-[#26292e] flex border-b-2 border-[#37527a] p-2 gap-2">
        <p className="text-[#37527a]">Чат</p>
        <p>от NextChat.sosal</p>
      </div>
      <div className="max-h-[90%] flex flex-col justify-center">
        {startSession && connectedUsers < 2 && !chatReady ? (
          <div className="w-full my-[60px]">
            <MainLoader />
            <p className="text-center">Поиск собеседника...</p>
          </div>
        ) : null}
        {chatReady && (
          <div className="w-full mb-[60px] flex flex-col justify-center items-center">
            <div className="w-full flex flex-col bg-slate-700 p-4 mb-4 h-[700px] overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <p
                  key={index}
                  className={`w-[80%] p-2 mb-2 rounded-lg ${
                    msg.id === socketRef.current?.id
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {msg.message}
                </p>
              ))}
            </div>
            <div className="w-full flex">
              <input
                type="text"
                value={message}
                className="w-full bg-slate-700"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button type="button" onClick={sendMessage}>
                Отправить
              </button>
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
        {startSession && chatReady && (
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
