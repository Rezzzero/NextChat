import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-slate-500">
      <div className="container max-w-5xl mx-auto flex text-white justify-between pt-4">
        <h1 className="text-2xl font-bold">NextChat.sosal</h1>
        <div className="flex gap-4 text-lg">
          <Link href="/chat">Чат</Link>
          <Link href="/voice-chat">Голосовой чат</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
