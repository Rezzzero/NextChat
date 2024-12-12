import { motion } from "framer-motion";
import { useState } from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const StartButton = ({
  agePicked,
  toggleSession,
  type,
  text,
}: {
  agePicked: string | boolean;
  toggleSession: () => void;
  type: string;
  text: string;
}) => {
  const [isAgeNotPicked, setIsNotAgePicked] = useState(false);
  const [startErrorAnimation, setStartErrorAnimation] = useState(false);
  const startError = () => {
    setIsNotAgePicked(true);
    setStartErrorAnimation(true);
  };

  const shakeAnimation = {
    initial: { x: 0 },
    animate: {
      x: [0, -6, 6, -2, 2, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  if (!agePicked) {
    return (
      <motion.div {...(startErrorAnimation ? shakeAnimation : {})}>
        <button
          type="button"
          className={`w-[220px] md:w-[300px] text-sm md:text-lg mt-4 mx-auto ${
            isAgeNotPicked
              ? "text-red-500 border-red-500 hover:bg-red-500 hover:text-[#1c1c1c]"
              : "text-[#4fe07f] border-[#4fe07f] hover:bg-[#4fe07f] hover:text-[#1c1c1c]"
          } border py-2 px-8 md:px-16 rounded-[25px]`}
          onClick={startError}
        >
          {type === "voice" && <LocalPhoneIcon className="mr-1 mb-1" />}
          {text}
        </button>
      </motion.div>
    );
  }
  return (
    <div>
      <button
        type="button"
        className="w-[220px] md:w-[300px] text-sm md:text-lg mt-4 mx-auto text-[#4fe07f] border py-2 px-8 md:px-16 rounded-[25px] border-[#4fe07f] hover:bg-[#4fe07f] hover:text-[#1c1c1c]"
        onClick={toggleSession}
      >
        {type === "voice" && <LocalPhoneIcon className="mr-1 mb-1" />}
        {text}
      </button>
    </div>
  );
};

export default StartButton;
