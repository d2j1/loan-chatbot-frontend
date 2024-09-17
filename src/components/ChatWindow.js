import React from "react";
import "../App.css"; // Import the styles

function ChatWindow({ chat, chatEndRef }) {
  return (
    <div className="chat-box">
      {chat.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender}`}
          dangerouslySetInnerHTML={{ __html: message.text }}
        />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow;
