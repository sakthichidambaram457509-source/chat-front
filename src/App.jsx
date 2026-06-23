import { useState } from "react";
import Login from "./pages/Login";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import Register from "./pages/Register";

function App() {
  const [showRegister, setShowRegister] =useState(false);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    
    
    if (token && userId) {
      return {
        id: Number(userId),
        username,
      };
    }

    return null;
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setSelectedUser(null);
  };

  if (showRegister) {
  return (
    <Register
      onBack={() => setShowRegister(false)}
    />
  );
}

  if (!user) {
   return (
  <Login
    onLogin={setUser}
    onShowRegister={() =>
      setShowRegister(true)
    }
  />
);
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white flex justify-between">
        <h2 className="font-bold">
          Welcome {user.username}
        </h2>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1">
        {/* User List */}
        <div className="w-1/4 border-r bg-gray-100">
          <UserList
            onSelectUser={setSelectedUser}
            currentUserId={user.id}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selectedUser ? (
            <ChatWindow
              currentUserId={user.id}
              selectedUser={selectedUser}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              Select a user
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;