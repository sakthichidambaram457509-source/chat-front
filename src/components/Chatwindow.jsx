import { useEffect, useState } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";

function ChatWindow({ currentUserId, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null);

  const token = localStorage.getItem("token");

  // Load old messages
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(
        `http://localhost:8080/messages/chat?senderId=${currentUserId}&receiverId=${selectedUser.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [selectedUser, currentUserId]);

  // WebSocket Connection
  useEffect(() => {
    const stompClient = new Client({
  brokerURL: `ws://localhost:8080/chat?token=${token}`,
  reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("CONNECTED");

      stompClient.subscribe("/topic/messages", (msg) => {
        const newMessage = JSON.parse(msg.body);

          console.log("WS MESSAGE:");

        setMessages((prev) => [...prev, newMessage]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.log("STOMP ERROR:", frame);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  // Send Message
  const sendMessage = () => {
    console.log("Current User:", currentUserId);
    console.log("Selected User:", selectedUser.id);

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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow">
        <h2 className="text-xl font-semibold">
          {selectedUser.username}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender?.id === currentUserId
                ? "bg-green-300 self-end"
                : "bg-white self-start"
            }`}
          >
            {/* {msg.content} */}
            {/* <div
  key={msg.id || index}
  className={`max-w-xs px-4 py-2 rounded-lg ${
    msg.sender?.id === currentUserId
      ? "bg-green-300 self-end"
      : "bg-white self-start"
  }`}
> */}
  <div>{msg.content}</div>

  <div className="text-xs text-gray-600 mt-1 text-right">
    {msg.timestamp
      ? new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""}
  </div>

          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;