import React from "react";

interface HeartDisplayProps {
  currentHp: number;
}

export function HeartDisplay({ currentHp }: HeartDisplayProps) {
  const percentage = Math.min(Math.max(currentHp, 0), 100);

  return (
    <div className="relative w-40 h-8">
      <img
        src="/images/heart_empty.png"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-contain opacity-50 grayscale" 
      />
      <div
        className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      >
        <img
          src="/images/heart_full.png"
          alt="Health"
          className="w-40 h-full max-w-none object-contain object-left"
        />
      </div>
    </div>
  );
}


