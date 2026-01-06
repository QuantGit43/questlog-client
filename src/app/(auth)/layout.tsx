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
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <Image
        src="/images/main_background.svg"
        alt="Pixel Mountain Background"
        fill
        className="object-cover"
        priority
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-500/40 via-purple-600/40 to-purple-900/70"></div>

      {/* GlassCard */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <GlassCard className="relative w-full max-w-md p-8">
          {/* Back Arrow */}
          <Link href="/" className="absolute top-4 left-4 opacity-80 hover:opacity-100 transition">
            <ArrowLeft size={24} />
          </Link>

          {/* Children (Login / Signup Forms) */}
          {children}
        </GlassCard>
      </div>
    </div>
  );
}
