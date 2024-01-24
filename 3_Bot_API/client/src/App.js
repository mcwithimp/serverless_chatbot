import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const LAMBDA_POST_CHATS =
  "https://t6rj6dqwdbzapbzaxfdifpdaeu0tbkwi.lambda-url.ap-northeast-2.on.aws/";

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
        setMessages(messages);
        console.log("API call failed");
        console.log(response);
        return;
      }
      return response;
    } catch (error) {
      console.error("API call error:", error);
      setMessages(messages);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;

    const message = { text: newMessage, sender: "user" };
    setMessages([...messages, message]);
    setNewMessage("");

    callApi(LAMBDA_POST_CHATS, "POST", { content: newMessage })
      .then((res) => res.json())
      .then((res) => {
        const parrotResponse = { text: res, sender: "bot" };
        setMessages((msgs) => [...msgs, parrotResponse]);
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
