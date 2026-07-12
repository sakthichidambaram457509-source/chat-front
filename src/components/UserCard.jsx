import Avatar from "./Avatar";

function UserCard({ user, selected, onClick }) {
  const displayName = user.username || user.email || "Unknown User";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition rounded-xl mx-2
      ${
        selected
          ? "bg-blue-100"
          : "hover:bg-gray-100"
      }`}
    >
      <Avatar
        username={displayName}
        online={true}
      />

      <div className="flex-1">
        <h3 className="font-semibold">
          {displayName}
        </h3>

        <p className="text-sm text-gray-500">
          Click to chat
        </p>
      </div>
    </div>
  );
}

export default UserCard;