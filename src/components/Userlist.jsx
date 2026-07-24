import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { API_BASE_URL } from "../config/api";

function UserList({
  onSelectUser,
  currentUserId,
  selectedUser,
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Users:", res.data);
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const filteredUsers = users
    .filter((user) => user && user.id !== currentUserId)
    .filter((user) =>
      (user.username ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-3">
          Chats
        </h2>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            selected={selectedUser?.id === user.id}
            onClick={() => onSelectUser(user)}
          />
        ))}
      </div>
    </div>
  );
}

export default UserList;