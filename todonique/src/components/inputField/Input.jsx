import React from "react";
import "./Input.css";

const Input = ({ type, name, value, onChange, required = false }) => {
  return (
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="input"
    />
  );
};

export default Input;