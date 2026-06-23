import { useState } from "react";
import axios from "axios";

function Register({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    // Frontend validation
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert("Registered Successfully");
      onBack();

    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data);
      } else {
        alert("Registration Failed");
      }
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-2xl mb-4">
          Register
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="bg-green-500 text-white w-full p-2"
        >
          Register
        </button>

        <button
          onClick={onBack}
          className="mt-3 text-blue-500"
        >
          Back to Login
        </button>

      </div>
    </div>
  );
}

export default Register;