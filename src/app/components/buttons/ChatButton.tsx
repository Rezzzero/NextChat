const ChatButton = ({
  toggleSession,
  text,
}: {
  toggleSession: () => void;
  text: string;
}) => {
  return (
    <button
      type="button"
      className="max-w-[300px] text-lg mt-4 mx-auto text-slate-500 border-slate-500 hover:bg-slate-500 hover:text-[#1c1c1c]  border-2 py-2 px-16 rounded-[25px]"
      onClick={toggleSession}
    >
      {text}
    </button>
  );
};

export default ChatButton;
