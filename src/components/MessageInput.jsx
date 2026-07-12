function MessageInput({
  message,
  setMessage,
  sendMessage,
}) {
  return (
    <div className="bg-white border-t p-4 flex gap-3">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3"
      >
        Send
      </button>

    </div>
  );
}

export default MessageInput;