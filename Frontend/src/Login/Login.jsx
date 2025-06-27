import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ userid: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userid, password } = formData;

    if (!userid || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        sessionStorage.setItem('token', data.token);
        alert("Login Successful!");
        // 🚀 Do something after login success, like redirect
        navigate("/"); // or your main page
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-sm bg-indigo-100/30 rounded-3xl shadow-lg border-4 border-white p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="userid"
            placeholder="User ID or Email"
            value={formData.userid}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-transparent shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-transparent shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          New user?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
