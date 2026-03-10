import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const Message = ({ variant = "info", children }) => {
  const getStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-50 text-red-800 border-red-200";
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "info":
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  const Icon =
    variant === "danger"
      ? AlertCircle
      : variant === "success"
        ? CheckCircle2
        : Info;

  return (
    <div
      className={`p-4 mb-4 border rounded-lg flex items-center space-x-3 ${getStyles()}`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-medium text-sm">{children}</span>
    </div>
  );
};

export default Message;
