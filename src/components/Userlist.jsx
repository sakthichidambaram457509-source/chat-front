import { useEffect, useState } from "react";
import axios from "axios";

function UserList({ onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/users", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2 className="p-4 font-bold text-lg">Users</h2>

      {users
        .filter((user) => user.id !== currentUserId)
        .map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="p-4 border-b cursor-pointer hover:bg-gray-200"
          >
            <h3 className="font-semibold">
              {user.username}
            </h3>
          </div>
        ))}
    </div>
  );
}

export default UserList;