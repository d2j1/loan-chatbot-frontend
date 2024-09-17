import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow";
import CustomInput from "./components/CustomInput";
import "./App.css";
import notificationSound from "./notification.mp3"; // Import the notification sound

function App() {
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hey there,",
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const chatEndRef = useRef(null);
  const notificationAudio = useRef(null);

  useEffect(() => {
    notificationAudio.current = new Audio(notificationSound);
  }, []);

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    // Add user message to chat
    const newChat = [...chat, { sender: "user", text: userMessage }];
    setChat(newChat);

    try {
      // Send the message to the backend (Node.js server)
      const response = await axios.post("http://localhost:3001/message", {
        message: userMessage,
      });

      // Play notification sound when bot responds
      notificationAudio.current.play();

      // Add bot's response to the chat
      setChat([...newChat, { sender: "bot", text: response.data.response }]);
    } catch (error) {
      console.error("Error sending message", error);
      setChat([
        ...newChat,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    }

    // Clear input field after message is sent
    setUserMessage("");
  };

  // Scroll to the bottom of the chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="App">
      <div className="chat-container">
        {/* Chatbot Name */}
        <div className="chat-header">
          <h2>Loan AI</h2>
        </div>
        <ChatWindow chat={chat} chatEndRef={chatEndRef} />
        <CustomInput
          userMessage={userMessage}
          setUserMessage={setUserMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* Audio element for notification sound */}
      <audio ref={notificationAudio} src={notificationSound} preload="auto" />
    </div>
  );
}

export default App;
