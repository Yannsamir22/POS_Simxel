import { Bell } from "lucide-react";
import { useState } from "react";

type AlertProps = {
  unreadCount: number;
  onClick?: () => void;
};

const Alert = ({ unreadCount, onClick }: AlertProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
      className="relative p-2 rounded-xl 
                 hover:bg-gray-100 
                 transition-colors duration-200"
    >
      {/* Unread Badge */}
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1
                     flex items-center justify-center
                     min-w-[20px] h-[20px]
                     px-1 text-[11px] font-semibold
                     text-white bg-red-600
                     rounded-full shadow-md"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {/* Bell Icon */}
      <Bell size={22} className="text-gray-700" />
    </button>
  );
};

export default Alert;