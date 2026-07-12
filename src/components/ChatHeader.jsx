import Avatar from "./Avatar";

function ChatHeader({ user }) {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center gap-4">

      <Avatar
        username={user.username}
        online={true}
      />

      <div>
        <h2 className="font-semibold text-lg">
          {user.username}
        </h2>

        <p className="text-sm text-green-600">
          Online
        </p>
      </div>

    </div>
  );
}

export default ChatHeader;