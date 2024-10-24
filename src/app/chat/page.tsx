"use client";

import { useState, useRef, useEffect } from "react";
import MainLoader from "../components/Loader/MainLoader";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";
import ChatButton from "../components/buttons/ChatButton";
import ChatSettings from "../components/Settings/ChatSettings";
import { defaultSettings } from "../constants/constants";
import StartButton from "../components/buttons/StartButton";

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
  const [selectedSettings, setSelectedSettings] = useState<{
    selectedGender: string;
    selectedAge: string;
    selectedCompanionGender: string;
    selectedCompanionAges: string[];
  }>(defaultSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedSettings = localStorage.getItem("chatSettings");
      if (savedSettings) {
        setSelectedSettings(JSON.parse(savedSettings));
      }
      setIsSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isSettingsLoaded) {
      localStorage.setItem("chatSettings", JSON.stringify(selectedSettings));
    }
  }, [selectedSettings, isSettingsLoaded]);

  const toggleSession = () => {
    if (startSession) {
      if (socketRef.current) {
        socketRef.current.emit("leave waiting room");
        socketRef.current.disconnect();
        socketRef.current = null;
        setChatMessages([]);
        setStartSession(false);
        setChatReady(false);
      }
    } else {
      socketRef.current = io("http://localhost:3001/chat", {
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("set filters", selectedSettings);
      });

      socketRef.current.on("updateUsersCount", (count) => {
        setConnectedUsers(count);
      });

      socketRef.current.on("chat ready", () => {
        setChatReady(true);
      });

      socketRef.current.on("chat not ready", () => {
        setStartSession(false);
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
        <p>от NextChat.com</p>
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
            <div className="w-full flex flex-col bg-slate-700 py-4 mb-4 h-[700px] overflow-y-auto">
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
          <div className="w-full my-[60px] flex flex-col justify-center items-center">
            <ChatSettings
              selectedSettings={selectedSettings}
              setSelectedSettings={setSelectedSettings}
            />
            <StartButton
              agePicked={
                selectedSettings.selectedGender === "someone" ||
                (selectedSettings.selectedGender !== "someone" &&
                  selectedSettings.selectedAge)
              }
              toggleSession={toggleSession}
              text="Начать Чат"
            />
          </div>
        )}
        {startSession && connectedUsers !== 2 && (
          <ChatButton toggleSession={toggleSession} text="Остановить Поиск" />
        )}
        {startSession && chatReady && (
          <ChatButton toggleSession={toggleSession} text="Завершить Чат" />
        )}
      </div>
    </div>
  );
};

export default Chat;
