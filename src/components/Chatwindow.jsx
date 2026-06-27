import { useEffect, useState, useRef } from "react"; // 🟢 Added useRef
import axios from "axios";
import { Client } from "@stomp/stompjs";

function ChatWindow({ currentUserId, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(null);
  
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // 🟢 Added loading state
  const messagesEndRef = useRef(null); // 🟢 Added ref for auto-scroll

  const token = localStorage.getItem("token");

  // 🟢 Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🟢 Trigger auto-scroll whenever 'messages' array changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load old messages
  useEffect(() => {
    if (!selectedUser) return;

    setIsLoadingMessages(true); // 🟢 Start loading when user is selected

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
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingMessages(false)); // 🟢 Stop loading
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
    return <div className="h-screen flex items-center justify-center text-gray-500">Select a user to start chatting</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow z-10">
        <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-100">
        
        {/* 🟢 Show Loading Spinner if fetching messages */}
        {isLoadingMessages ? (
          <div className="flex-1 flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                  msg.sender?.id === currentUserId
                    ? "bg-green-300 self-end"
                    : "bg-white self-start"
                }`}
              >
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
            {/* 🟢 Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <form 
        className="p-4 border-t flex gap-2 bg-white"
        onSubmit={(e) => {
          e.preventDefault(); // 🟢 Pressing 'Enter' key will now send the message!
          sendMessage();
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-5 py-2 rounded-lg font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;