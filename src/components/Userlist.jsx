import { useEffect, useState } from "react";
import axios from "axios";

function UserList({ onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 🟢 Added loading state

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/users", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false)); // 🟢 Stop loading when done
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h2 className="p-4 font-bold text-lg border-b">Users</h2>

      {/* 🟢 Loading Spinner */}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="overflow-y-auto">
          {users
            .filter((user) => user.id !== currentUserId)
            .map((user) => (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className="p-4 border-b cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <h3 className="font-semibold">{user.username}</h3>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default UserList;