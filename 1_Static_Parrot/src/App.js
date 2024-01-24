import React, { useState, useEffect, useRef } from "react";
import "./App.css"; // Make sure to create a corresponding CSS file

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;

    // Here you would typically send the message to your backend or API
    const message = { text: newMessage, sender: "user" };
    setMessages([...messages, message]);

    // Simulate a response from ChatGPT (replace this with actual API call)
    setTimeout(() => {
      const botResponse = {
        text: "안녕하세요. 무엇을 도와드릴까요?",
        sender: "bot",
      };
      setMessages((msgs) => [...msgs, botResponse]);
    }, 1000);

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {}
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
