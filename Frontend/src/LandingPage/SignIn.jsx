import React, { useState } from "react";

const SignIn = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required.");
    } else if (!email.includes("@")) {
      setError("Please enter a valid email.");
    } else {
      setError("");
      alert("Sign Up Successful!");
      onBackToLogin(); // redirect to login
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="w-full max-w-sm bg-indigo-100/30 rounded-3xl shadow-lg border-4 border-white p-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Sign Up
        </h2>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-transparent shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
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
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onBackToLogin}
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
