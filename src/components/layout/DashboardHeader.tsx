"use client";

import { useState } from "react";
import Image from "next/image";
import UserProfileDropdown from "@/components/ui/UserProfileDropdown";

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="relative w-full flex justify-end px-6 py-4">
      <div className="relative">
        {/* AVATAR */}
        <button
          onClick={() => setIsProfileOpen(prev => !prev)}
          className="w-10 h-10 rounded-full overflow-hidden border"
        >
          <Image
            src="/images/avatar.png"
            alt="Avatar"
            width={40}
            height={40}
          />
        </button>

        {/* DROPDOWN */}
        {isProfileOpen && (
          <UserProfileDropdown
            onClose={() => setIsProfileOpen(false)}
          />
        )}
      </div>
    </header>
  );
}
