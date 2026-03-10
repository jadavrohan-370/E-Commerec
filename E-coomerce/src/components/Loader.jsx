import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ className = "w-10 h-10", fullScreen = true }) => {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "min-h-[50vh]" : ""}`}
    >
      <Loader2 className={`animate-spin text-teal-500 ${className}`} />
    </div>
  );
};

export default Loader;
