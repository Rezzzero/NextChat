"use client";

import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";

const VoiceChat = () => {
  const [startSession, setStartSession] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (startSession) {
      socketRef.current = io("http://localhost:3001/voice-chat", {
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
      });

      socketRef.current.on("chat ready", () => {
        setChatReady(true);

        peerRef.current = new Peer();

        peerRef.current.on("open", (peerId) => {
          console.log("My Peer ID is:" + peerId);
          socketRef.current?.emit("peer-id", peerId);
        });

        socketRef.current?.on("peer-id", (peerId) => {
          console.log("Received Peer ID: " + peerId);

          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              currentCallRef.current = stream;
              const call = peerRef.current?.call(peerId, stream);

              call?.on("stream", (remoteStream) => {
                const audio = new Audio();
                audio.srcObject = remoteStream;
                audio.play();
              });
            })
            .catch((error) => {
              console.error("Error accessing audio stream:", error);
            });
        });

        peerRef.current.on("call", (call) => {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              currentCallRef.current = stream;
              call.answer(stream);

              call.on("stream", (remoteStream) => {
                const audio = new Audio();
                audio.srcObject = remoteStream;
                audio.play();
              });
            })
            .catch((error) => {
              console.error("Error accessing audio stream:", error);
            });
        });
      });

      socketRef.current.on("chat not ready", () => {
        setChatReady(false);
      });

      return () => {
        socketRef.current?.disconnect();
        if (peerRef.current) {
          peerRef.current.destroy();
        }
      };
    }
  }, [startSession]);

  const toggleSession = () => {
    setStartSession(!startSession);
  };

  return (
    <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-[#1c1c1c] text-white">
      <div className="h-[5vh] bg-[#26292e] flex border-b-2 border-[#37527a] p-2 gap-2">
        <p className="text-[#37527a]">Голосовой чат</p>
        <p>от NextChat.sosal</p>
      </div>
      <div>
        {!startSession && (
          <button onClick={toggleSession}>Начать голосовой чат</button>
        )}
        {startSession && chatReady && (
          <div>
            <p>Голосовой чат готов!</p>
            <button onClick={toggleSession}>Завершить голосовой чат</button>
          </div>
        )}
        {startSession && !chatReady && (
          <p>Поиск собеседника для голосового чата...</p>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
