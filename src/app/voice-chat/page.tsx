"use client";

import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";
import ChatButton from "../components/buttons/ChatButton";
import MainLoader from "../components/Loader/MainLoader";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import ChatSettings from "../components/Settings/ChatSettings";
import StartButton from "../components/buttons/StartButton";
import { useChatSettings } from "../hooks/settings/useChatSettings";
import { ThemeSettings } from "../components/Settings/ThemeSettings";

const VoiceChat = () => {
  const [startSession, setStartSession] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(isMuted);
  const [volume, setVolume] = useState(100);
  const volumeRef = useRef(volume);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { selectedSettings, setSelectedSettings } = useChatSettings({
    storage: "voiceChatSettings",
  });

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (startSession) {
      socketRef.current = io("http://localhost:3001/voice-chat", {
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("set filters", selectedSettings);
      });

      socketRef.current.on("chat ready", () => {
        setChatReady(true);
        startRecordingLoop();
      });

      socketRef.current.on("voice-data", ({ audioData }) => {
        playAudioStream(audioData);
      });

      socketRef.current.on("end call", () => {
        endCallCleanup();
      });

      socketRef.current.on("chat not ready", () => {
        setChatReady(false);
      });

      return () => {
        socketRef.current?.emit("leave waiting room");
        socketRef.current?.disconnect();
        endCallCleanup();
      };
    }
  }, [startSession]);

  const startRecordingLoop = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    const recordCycle = () => {
      if (mediaRecorderRef.current?.state !== "recording") {
        mediaRecorderRef.current?.start();
      }
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current?.stop();
        }
      }, 1000);
    };

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (!isMutedRef.current) {
        const audioBlob = event.data;
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          let base64Audio: string | undefined;

          if (typeof reader.result === "string") {
            base64Audio = reader.result.split(",")[1];
          }
          socketRef.current?.emit("voice-data", base64Audio);
        };
      }
    };

    mediaRecorderRef.current.onerror = (event) => {
      console.error("Ошибка записи:", event.error);
    };

    recordCycle();

    mediaRecorderRef.current.onstop = recordCycle;
  };

  const playAudioStream = (audioData: string) => {
    const audio = new Audio(`data:audio/wav;base64,${audioData}`);
    audio.volume = volumeRef.current / 100;
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  const endCallCleanup = () => {
    setStartSession(false);
    setChatReady(false);
    setIsMuted(false);
    setVolume(100);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleSession = () => {
    setStartSession((prev) => !prev);
    if (startSession) {
      endCallCleanup();
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (value: number | number[]) => {
    const volumeValue = Array.isArray(value) ? value[0] : value;
    setVolume(volumeValue);
  };

  return (
    <div className="bg-background">
      <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-chatColor text-textColor">
        <div className="h-[5vh] bg-chatHeaderBg flex border-b-2 border-[#37527a] p-2 gap-2">
          <p className="text-[#37527a] font-bold">Голосовой чат</p>
          <p>от NextChat.com</p>
        </div>
        <div className="flex flex-col justify-center">
          {!startSession && (
            <div className="w-full my-[60px] flex flex-col justify-center items-center">
              <ChatSettings
                selectedSettings={selectedSettings}
                setSelectedSettings={setSelectedSettings}
              />
              <ThemeSettings />
              <StartButton
                agePicked={
                  selectedSettings.selectedGender === "someone" ||
                  (selectedSettings.selectedGender !== "someone" &&
                    selectedSettings.selectedAge)
                }
                toggleSession={toggleSession}
                text="Начать разговор"
              />
            </div>
          )}
          {startSession && chatReady && (
            <div className="w-full my-[60px] flex flex-col items-center">
              <div className="w-[100px] flex justify-center">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={volume}
                  onChange={handleVolumeChange}
                  trackStyle={{ backgroundColor: "#5138E9" }}
                  handleStyle={{ backgroundColor: "#5138E9" }}
                />
              </div>
              <p>Голосовой чат готов!</p>
              <button onClick={toggleMute} className="mute-button">
                {isMuted ? <MicOffIcon sx={{ color: "red" }} /> : <MicIcon />}
              </button>
              <ChatButton
                toggleSession={toggleSession}
                text="Закончить разговор"
              />
            </div>
          )}
          {startSession && !chatReady && (
            <div className="w-full my-[60px] flex flex-col items-center">
              <MainLoader />
              <p className="text-center">Поиск собеседника...</p>
              <ChatButton
                toggleSession={toggleSession}
                text="Остановить поиск"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
