import React, { useState } from "react";
import Lottie from "lottie-react";
import brainbot from "./Images/Brainbot.json";
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
  const from = location.state?.from || "/journal";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userid", userid);
        alert("Sign Up Successful!");

        const pendingText = sessionStorage.getItem("pending_journal");
        const pendingAnalysis = sessionStorage.getItem("pending_analysis");

        if (pendingText && pendingAnalysis) {
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
        }

        navigate(from, { replace: true });
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#f9f9fc]">
      {/* Top-right Privacy & Terms */}
      <div className="absolute top-6 right-6 z-20 flex gap-4 text-gray-700 text-sm">
        <button
          className="hover:underline"
          onClick={() => navigate("/privacy")}
        >
          Privacy
        </button>
        <button className="hover:underline" onClick={() => navigate("/terms")}>
          Terms
        </button>
      </div>

      {/* Top-Left Brand */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-white text-2xl font-semibold">Neuroflow</h1>
      </div>

      {/* Purple Background Curve */}
      <div className="absolute w-[117%] h-[220%] bg-gradient-to-tr from-[#796fc1] to-[#838beb] rounded-r-[50%] -left-1/2 -bottom-1/3 z-0" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Purple Section */}
        <div className="w-1/2 relative flex flex-col justify-center pl-20 pr-5 text-white">
          <div className="z-10 mr-20">
            <h2 className="text-4xl font-bold leading-snug mb-2">
              Get started with <br />
              Neuroflow
            </h2>
            <p className="text-lg opacity-90">
              Journal your thoughts, track your emotions, and boost your
              productivity - all in one place.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 flex justify-start items-center mt-20 ">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 pt-12 relative">
            {/* Brain image on top of form */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <Lottie
                animationData={brainbot}
                loop={true}
                className="w-32 h-32"
              />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Sign Up
            </h2>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="userid"
                placeholder="User ID"
                value={formData.userid}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#838ebe] placeholder-gray-500"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#838ebe] placeholder-gray-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#838ebe] placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-tr from-[#796fc1] to-[#838ebe] text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-md"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#5762E4] font-medium hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
