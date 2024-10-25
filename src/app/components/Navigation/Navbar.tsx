"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathName = usePathname();
  return (
    <div className="w-full h-16 bg-slate-500">
      <div className="container max-w-5xl mx-auto flex text-white justify-between pt-4">
        <h1 className="text-2xl font-bold">NextChat.com</h1>
        <div className="flex gap-4 text-lg">
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
    </div>
  );
};

export default Navbar;
