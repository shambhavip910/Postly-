import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", username: "", email: "", age: "", password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/create", form);
      navigate("/profile");
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white flex items-center justify-center">
      <div className="w-full max-w-md px-8 py-12 bg-zinc-800 rounded-2xl">
        <h1 className="text-3xl font-bold mb-1">Postly</h1>
        <p className="text-zinc-400 text-sm mb-8">share what's on your mind.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          <input
            className="bg-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            type="text" placeholder="name" name="name"
            value={form.name} onChange={handleChange}
          />
          <input
            className="bg-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            type="text" placeholder="username" name="username"
            value={form.username} onChange={handleChange}
          />
          <input
            className="bg-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            type="text" placeholder="email" name="email"
            value={form.email} onChange={handleChange}
          />
          <input
            className="bg-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            type="number" placeholder="age" name="age"
            value={form.age} onChange={handleChange}
          />
          <input
            className="bg-zinc-700 text-sm placeholder-zinc-500 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            type="password" placeholder="password" name="password"
            value={form.password} onChange={handleChange}
          />
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold py-3 rounded-lg mt-1"
          >
            Create Account
          </button>
        </div>

        <p className="text-zinc-500 text-sm mt-5 text-center">
          Already registered?{" "}
          <Link className="text-indigo-400 hover:underline" to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
