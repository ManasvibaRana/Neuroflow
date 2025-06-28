import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    userid: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/journal"; // where to go after signup

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userid, email, password } = formData;

    if (!userid || !email || !password) {
      setError("All fields are required.");
      return;
    } else if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    } else if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userid", userid); // Save for journal use
        alert("Sign Up Successful!");

        // ✅ Auto-save journal if written before signup
        const pendingText = sessionStorage.getItem("pending_journal");
        const pendingAnalysis = sessionStorage.getItem("pending_analysis");

        if (pendingText && pendingAnalysis) {
          try {
            console.log("💾 Auto-saving journal after signup:", {
              userid,
              text: pendingText,
              analysis: JSON.parse(pendingAnalysis),
            });

            await fetch("http://localhost:8000/journal/save/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
              body: JSON.stringify({
                userid,
                text: pendingText,
                analysis: JSON.parse(pendingAnalysis),
              }),
            });

            sessionStorage.removeItem("pending_journal");
            sessionStorage.removeItem("pending_analysis");
          } catch (saveError) {
            console.error("❌ Failed to auto-save journal after signup:", saveError);
          }
        }

        navigate(from, { replace: true });
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
            name="userid"
            placeholder="User ID"
            value={formData.userid}
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
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
