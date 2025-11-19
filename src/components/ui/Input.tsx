import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  className,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "w-full rounded-full px-5 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border-none outline-none transition-all duration-150";

  const focusStyles = "focus:ring-2 focus:ring-white focus:outline-none";

  const disabledStyles =
    "opacity-50 cursor-not-allowed bg-white/10 placeholder-white/30";

  return (
    <input
      disabled={disabled}
      className={clsx(
        baseStyles,
        !disabled && focusStyles,
        disabled && disabledStyles,
        className
      )}
      {...props}
    />
  );
};

export default Input;
