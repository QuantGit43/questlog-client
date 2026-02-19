"use client";

import { useRef } from "react";
import { Settings, LogOut } from "lucide-react";
import { useClickOutside } from "./useClickOutside";

type Props = {
  onClose: () => void;
};

export default function UserProfileDropdown({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  useClickOutside(ref as React.RefObject<HTMLElement>, onClose);
  const user = {
    name: "Player One",
    level: 1,
    xp: 40,
    xpMax: 100,
  };

  const xpPercent = (user.xp / user.xpMax) * 100;

  return (
    <div
      ref={ref}
      className="
        absolute right-0 mt-2 w-56 z-50
        bg-[url('/images/scroll_vertical.png')]
        bg-no-repeat bg-contain bg-center
        px-4 py-6 text-[#3b2f1c]
      "
    >
      <div className="text-center font-bold mb-1">
        {user.name}
      </div>
      <div className="text-center text-sm mb-2">
        Level {user.level}
      </div>
      <div className="mb-4">
        <div className="h-2 w-full rounded bg-[#cbb58b] overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <div className="text-xs text-center mt-1">
          {user.xp} / {user.xpMax} XP
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="flex items-center justify-center gap-2 rounded px-2 py-1 hover:bg-black/10 transition"
        >
          <Settings size={16} />
          Settings
        </button>

        <button
          className="flex items-center justify-center gap-2 rounded px-2 py-1 hover:bg-red-500/20 transition"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}

