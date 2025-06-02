import React from "react";
import "./Message.css";

const Message = ({ message, type = "info" }) => {
  if (!message) return null;

  return (
    <div className={`message message-${type}`}>
      <p className="message-text">{message}</p>
    </div>
  );
};

export default Message;