import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// 'REACT_APP_' 필수
const { REACT_APP_LAMBDA_GET_CHAT, REACT_APP_LAMBDA_POST_CHAT } = process.env;

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChat = () => {
    callApi(REACT_APP_LAMBDA_GET_CHAT, "GET", null)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.sort((a, b) => a.id - b.id));
      });
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callApi = async (url, method, body) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const payload = body
        ? { method, headers, body: JSON.stringify(body) }
        : { method, headers };
      const response = await fetch(url, payload);
      if (!response.ok) {
        setNewMessage(messages);
        console.log("API call failed");
        console.log(response);
        return;
      }
      return response;
    } catch (error) {
      console.error("API call error:", error);
      setNewMessage(messages);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;

    const message = {
      id: messages.length,
      text: newMessage,
      sender: "user",
      timestamp: Date.now(),
    };
    setMessages([...messages, message]);
    setNewMessage("");

    callApi(REACT_APP_LAMBDA_POST_CHAT, "POST", message)
      .then((res) => res.json())
      .then((msg) => {
        setMessages((msgs) => [...msgs, msg]);
      });
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
