const ChatButton = ({
  toggleSession,
  active,
  text,
}: {
  toggleSession: () => void;
  active: boolean;
  text: string;
}) => {
  return (
    <button
      type="button"
      className={`max-w-[300px] mt-4 mx-auto ${
        active
          ? "text-[#4fe07f] border-[#4fe07f] hover:bg-[#4fe07f] hover:text-[#1c1c1c]"
          : "text-slate-500 border-slate-500 hover:bg-slate-500 hover:text-[#1c1c1c]"
      } border-2 py-2 px-16 rounded-[25px]`}
      onClick={toggleSession}
    >
      {text}
    </button>
  );
};

export default ChatButton;
