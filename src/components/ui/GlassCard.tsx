import React from "react";
import clsx from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  const baseStyles =
    "rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg";

  return (
    <div className={clsx(baseStyles, className)}>
      {children}
    </div>
  );
};

export default GlassCard;
