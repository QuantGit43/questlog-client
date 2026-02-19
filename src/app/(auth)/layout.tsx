"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center p-4">
      <Image
        src="/images/main_background.svg"
        alt="Pixel Mountain Background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/40 via-purple-600/40 to-purple-900/70"></div>

      <GlassCard className="relative w-full max-w-md p-8 flex flex-col items-center text-center z-10 animate-fade-in-up">
        <Link
          href="/"
          className="absolute top-4 left-4 opacity-70 hover:opacity-100 transition text-white hover:scale-110"
        >
          <ArrowLeft size={24} />
        </Link>
        {children}
      </GlassCard>
    </div>
  );
}

