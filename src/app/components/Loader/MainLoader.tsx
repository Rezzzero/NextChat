"use client";
import { CircularProgress } from "@mui/material";

const MainLoader = () => {
  return (
    <div className="w-full h-[200px] flex justify-center items-center">
      <CircularProgress sx={{ color: "rgb(100 116 139)" }} />
    </div>
  );
};

export default MainLoader;
