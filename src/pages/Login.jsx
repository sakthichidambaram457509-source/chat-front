import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/login",
        {
          username,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "userId",
        res.data.id
      );

      localStorage.setItem(
        "username",
        res.data.username
      );

      onLogin(res.data);

    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-2xl mb-4">
          Login
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Login
        </button>
        <button
  onClick={onShowRegister}
  className="mt-3 text-blue-500"
>
  Create Account
</button>

      </div>
    </div>
  );
}

export default Login;