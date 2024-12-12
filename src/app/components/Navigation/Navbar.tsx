"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import MicIcon from "@mui/icons-material/Mic";

const Navbar = () => {
  const pathName = usePathname();
  return (
    <div className="w-full h-12 md:h-16 bg-[#37527a]">
      <div className="container max-w-5xl mx-auto flex text-white justify-between pt-2 md:pt-4 mb-3 md:mb-0">
        <h1 className="text-lg md:text-2xl font-bold ml-2 md:ml-0">
          NextChat.com
        </h1>
        <div className="hidden md:flex gap-4 text-lg">
          <Link
            href="/chat"
            className={pathName === "/chat" ? "underline" : ""}
          >
            Чат
          </Link>
          <Link
            href="/voice-chat"
            className={pathName === "/voice-chat" ? "underline" : ""}
          >
            Голосовой чат
          </Link>
        </div>
      </div>
      <div className="flex md:hidden justify-center gap-2 text-white">
        <Link
          href="/chat"
          className={`${
            pathName === "/chat" ? "bg-[#37527a]" : ""
          } w-full text-center text-base`}
        >
          <ModeEditOutlineIcon
            sx={{ fontSize: "1rem", mb: "4px", mr: "4px" }}
          />
          Текстовый чат
        </Link>
        <Link
          href="/voice-chat"
          className={`${
            pathName === "/voice-chat" ? "bg-[#37527a]" : ""
          } w-full text-center text-base`}
        >
          <MicIcon sx={{ fontSize: "1rem", mb: "4px", mr: "4px" }} />
          Голосовой чат
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
