import React from "react";
import "./Button.css";

const Button = ({ 
  type = "button", 
  onClick, 
  children, 
  variant = "primary", 
  disabled = false 
}) => {
  const buttonClass = `button button-${variant}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );
};

export default Button;