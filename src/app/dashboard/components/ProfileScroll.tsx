"use client";

import { motion } from "framer-motion";

interface ProfileScrollProps {
  username: string;
  level: number;
  xpProgress: number;
  onLogout: () => void;
}

export const ProfileScroll = ({ username, level, xpProgress, onLogout }: ProfileScrollProps) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute right-10 top-20 z-50 pointer-events-auto filter drop-shadow-2xl"
    >
      <div
        className="w-72 h-[450px] bg-contain bg-no-repeat bg-center flex flex-col items-center pt-24 px-8 pb-12 text-[#5d4037]"
        style={{ backgroundImage: "url('/images/dashboard/paper.png')" }}
      >
        <div className="w-full text-center space-y-4">
          <div>
            <h2 className="font-bold text-lg uppercase tracking-wider border-b border-[#8d6e63]/30 pb-1 mb-1">
              {username}
            </h2>
            <p className="text-sm font-semibold">Level {level}</p>
          </div>

          {/* XP Bar */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-bold mb-1 px-1">
              <span>XP</span>
              <span>{Math.round(xpProgress)} / 100</span>
            </div>
            <div className="w-full h-4 bg-black/20 rounded-full border border-[#5d4037]/50 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-green-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col gap-2 w-full border-t border-[#8d6e63]/20">
            <button
              onClick={onLogout}
              className="group opacity-80 hover:opacity-100 transition-opacity flex justify-center"
            >
              <img src="/images/dashboard/LogOut.png" alt="Logout" className="w-24 h-8 object-contain" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};