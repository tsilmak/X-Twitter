import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "destructive";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
  size = "large",
  fullWidth = true,
  className = "",
}) => {
  const getVariantStyles = () => {
    if (variant === "primary") {
      return disabled
        ? "bg-buttonDisabledBg text-white dark:text-black cursor-not-allowed"
        : "dark:bg-white dark:text-black bg-buttonPrimaryBg hover:bg-buttonPrimaryHover text-white dark:hover:bg-gray-200";
    }
    if (variant === "destructive") {
      return disabled
        ? "bg-buttonDisabledBg text-white dark:text-black cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700";
    }
    // Add more variants here in the future
    return "";
  };

  const getSizeStyles = () => {
    if (size === "small") return "py-1.5";
    if (size === "medium") return "py-2";
    return "py-3"; // large
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`font-bold ${getSizeStyles()} rounded-full ${getVariantStyles()} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
