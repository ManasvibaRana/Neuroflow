import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import brainbot from "./Images/Brainbot.json";
import { toast } from "sonner";
import useChimes from "../usechimes";

const Login = () => {
  const [formData, setFormData] = useState({ userid: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/journal";
  const { startChimeRef, successChimeRef, errorChimeRef } = useChimes();
  
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userid, password } = formData;

    if (!userid || !password) {
      setError("All fields are required.");
      errorChimeRef.current?.play();
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userid", data.userid);
        toast.success("✅ Login Successful!");
        successChimeRef.current?.play();

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
              userid: data.userid,
              text: pendingText,
              analysis: JSON.parse(pendingAnalysis),
            }),
          });

          sessionStorage.removeItem("pending_journal");
          sessionStorage.removeItem("pending_analysis");
        }

        navigate(from, { replace: true });
      } else {
        setError(data.error || "Login failed");
        errorChimeRef.current?.play();
        toast.error(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      errorChimeRef.current?.play();
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#f9f9fc]">
      {/* Top-right Privacy & Terms */}
      <div className="absolute top-6 right-6 z-20 flex gap-4 text-white text-sm">
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
        <h1 className="text-gray-800 text-2xl font-bold">NeuroFlow</h1>
      </div>

      {/* Purple Background Curve (on Right side now) */}
      <div className="absolute w-[117%] h-[220%] bg-gradient-to-tr from-[#796fc1] to-[#838beb] rounded-l-[50%] -right-1/2 -bottom-1/3 z-0" />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Form Section */}
        <div className="w-1/2 flex justify-end items-center mt-20 pr-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 pt-12 relative">
            {/* Brain animation on top */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <Lottie animationData={brainbot} loop className="w-32 h-32" />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Login
            </h2>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="userid"
                placeholder="User ID or Email"
                value={formData.userid}
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
                Login
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              New user?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-[#5762E4] font-medium hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Right Purple Text Section */}
        <div className="w-1/2 relative flex flex-col justify-center pl-5 pr-20 text-white">
          <div className="z-10 ml-20">
            <h2 className="text-4xl font-bold leading-snug mb-2">
              Welcome back to <br />
              Neuroflow
            </h2>
            <p className="text-lg opacity-90">
              Your thoughts matter. Continue your journey of self-reflection and
              productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
