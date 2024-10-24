"use client";

import Peer from "peerjs";
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
import { defaultSettings } from "../constants/constants";
import StartButton from "../components/buttons/StartButton";

const VoiceChat = () => {
  const [startSession, setStartSession] = useState(false);
  const [chatReady, setChatReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const peerRef = useRef<Peer | null>(null);
  const currentCallRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedSettings, setSelectedSettings] = useState<{
    selectedGender: string;
    selectedAge: string;
    selectedCompanionGender: string;
    selectedCompanionAges: string[];
  }>(defaultSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedSettings = localStorage.getItem("voiceChatSettings");
      if (savedSettings) {
        setSelectedSettings(JSON.parse(savedSettings));
      }
      setIsSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isSettingsLoaded) {
      localStorage.setItem(
        "voiceChatSettings",
        JSON.stringify(selectedSettings)
      );
    }
  }, [selectedSettings, isSettingsLoaded]);

  useEffect(() => {
    const handleRemoteStream = (remoteStream: MediaStream) => {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.volume = volume / 100;
      audio.play();
      audioRef.current = audio;
    };

    if (startSession) {
      socketRef.current = io("http://localhost:3001/voice-chat", {
        path: "/socket.io",
      });

      socketRef.current.on("connect", () => {
        socketRef.current?.emit("set filters", selectedSettings);
      });

      socketRef.current.on("is-initiator", (isInitiator: boolean) => {
        peerRef.current = new Peer();

        peerRef.current.on("open", (peerId) => {
          socketRef.current?.emit("peer-id", peerId);
        });

        if (isInitiator) {
          socketRef.current?.on("peer-id", (peerId) => {
            if (peerRef.current?.id !== peerId) {
              navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                  currentCallRef.current = stream;
                  const call = peerRef.current?.call(peerId, stream);

                  call?.on("stream", handleRemoteStream);
                })
                .catch((error) => {
                  console.error("Error accessing audio stream:", error);
                });
            }
          });
        } else {
          peerRef.current.on("call", (call) => {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                currentCallRef.current = stream;
                call.answer(stream);

                call?.on("stream", handleRemoteStream);
              })
              .catch((error) => {
                console.error("Error accessing audio stream:", error);
              });
          });
        }
      });

      socketRef.current.on("chat ready", () => {
        setChatReady(true);
      });

      socketRef.current.on("end call", () => {
        setStartSession(false);
        setChatReady(false);
        setIsMuted(false);
        setVolume(100);
        audioRef.current = null;

        if (currentCallRef.current) {
          currentCallRef.current.getTracks().forEach((track) => {
            track.stop();
          });

          currentCallRef.current = null;
        }

        if (peerRef.current) {
          peerRef.current.destroy();

          peerRef.current = null;
        }
      });

      socketRef.current.on("chat not ready", () => {
        setChatReady(false);
      });

      return () => {
        socketRef.current?.emit("leave waiting room");
        socketRef.current?.disconnect();
        setChatReady(false);
        if (peerRef.current) {
          peerRef.current.destroy();
        }
        peerRef.current = new Peer();
        setStartSession(false);
      };
    }
  }, [startSession]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    } else {
      console.log("No audio reference available");
    }
  }, [volume]);

  const toggleSession = () => {
    setStartSession(!startSession);
  };

  const toggleMute = () => {
    if (currentCallRef.current) {
      const audioTracks = currentCallRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (value: number | number[]) => {
    const volumeValue = Array.isArray(value) ? value[0] : value;

    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  return (
    <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-[#1c1c1c] text-white">
      <div className="h-[5vh] bg-[#26292e] flex border-b-2 border-[#37527a] p-2 gap-2">
        <p className="text-[#37527a]">Голосовой чат</p>
        <p>от NextChat.com</p>
      </div>
      <div className="flex flex-col justify-center">
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
            <ChatButton toggleSession={toggleSession} text="Остановить поиск" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
