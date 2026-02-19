import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "arrow";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center select-none rounded-full font-pixel px-6 py-3 transition-all duration-150";

  const primaryGradient =
    "bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_4px_0_#2b2b2b]";

  const hoverPrimary =
    "hover:brightness-110 hover:from-blue-300 hover:to-purple-400";

  const activePress = "active:translate-y-[3px] active:shadow-none";

  const disabledStyles =
    "bg-gray-400 text-gray-700 shadow-[0_4px_0_#6b6b6b] cursor-not-allowed opacity-60";

  const variantStyles: Record<string, string> = {
    primary: primaryGradient,
    arrow: primaryGradient,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        disabled ? disabledStyles : variantStyles[variant],
        !disabled && hoverPrimary,
        !disabled && activePress,
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {variant === "arrow" && <span className="text-lg">→</span>}
      </span>
    </button>
  );
};

export default Button;
