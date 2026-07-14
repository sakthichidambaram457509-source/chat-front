import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

function ChatWindow({ currentUserId, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Chat History
  useEffect(() => {
    if (!selectedUser) return;

    setIsLoadingMessages(true);

    axios
      .get(
        `https://chat-6oy5.onrender.com/messages/chat?senderId=${currentUserId}&receiverId=${selectedUser.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        setMessages(res.data);
      })
      .catch(console.log)
      .finally(() => {
        setIsLoadingMessages(false);
      });
  }, [selectedUser, currentUserId]);

  // WebSocket
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: `wss://chat-6oy5.onrender.com/chat?token=${token}`,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("CONNECTED");

      stompClient.subscribe("/topic/messages", (msg) => {
        const newMessage = JSON.parse(msg.body);

        console.log("WS MESSAGE:", newMessage);

        setMessages((prev) => [...prev, newMessage]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.log(frame);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, []);

  // Send Message
  const sendMessage = () => {
    if (!client || !message.trim()) return;

    client.publish({
      destination: "/app/send",
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: selectedUser.id,
        content: message,
      }),
    });

    setMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      <ChatHeader user={selectedUser} />

      <div className="flex-1 overflow-y-auto bg-slate-100 p-6 flex flex-col gap-3">

        {isLoadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMine={msg.sender?.id === currentUserId}
              />
            ))}

            <div ref={messagesEndRef}></div>
          </>
        )}
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

    </div>
  );
}

export default ChatWindow;