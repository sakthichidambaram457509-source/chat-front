function MessageBubble({ msg, isMine }) {
  return (
    <div
      className={`max-w-sm px-4 py-2 rounded-2xl shadow
      ${
        isMine
          ? "bg-green-500 text-white self-end"
          : "bg-white self-start"
      }`}
    >
      <p>{msg.content}</p>

      <div
        className={`text-xs mt-2 ${
          isMine ? "text-green-100" : "text-gray-500"
        } text-right`}
      >
        {msg.timestamp &&
          new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
      </div>
    </div>
  );
}

export default MessageBubble;