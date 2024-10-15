"use client";

import { useState } from "react";
import MainLoader from "../components/Loader/MainLoader";

const Chat = () => {
  const [startSession, setStartSession] = useState(false);
  return (
    <div className="container max-w-2xl h-[94vh] mx-auto text-2xl bg-[#1c1c1c] text-white">
      <div className="h-[5vh] bg-[#26292e] flex border-b-2 border-[#37527a] p-2 gap-2">
        <p className="text-[#37527a]">Чат</p>
        <p>от NextChat.sosal</p>
      </div>
      <div className="max-h-[60%] flex flex-col justify-center">
        {startSession && (
          <div className="w-full my-[60px]">
            <MainLoader />
            <p className="text-center">Поиск собеседника...</p>
          </div>
        )}
        <button
          className={`max-w-[300px] mx-auto ${
            startSession
              ? "text-slate-500 border-slate-500 hover:bg-slate-500 hover:text-[#1c1c1c]"
              : "text-[#4fe07f] border-[#4fe07f] hover:bg-[#4fe07f] hover:text-[#1c1c1c]"
          } border-2 py-2 px-6 rounded-[25px]`}
          onClick={() => setStartSession(!startSession)}
        >
          {startSession ? "Остановить поиск" : "Начать Чат"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
