import React from "react";
import Lottie from "lottie-react";
import brainAnimation from "./Images/brain.json";
import { Navigate, useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full min-h-screen flex items-center bg-white overflow-hidden"
      id="Home"
    >
      {/* Left Purple Background Half */}
      {/* <div className="absolute h-[150%] w-[1600px] md:w-[105%] bg-gradient-to-tr from-[#796fc1] to-[#838beb] -top-[450px] -left-1/2 z-0 transform translate3d(-50%,0,0) rounded-[50%]" /> */}
      <div
        className="absolute inset-y-0 md:w-[55%] w-[200%] bg-gradient-to-br from-[#796fc1] to-[#838beb] z-0 
      rounded-b-[700px] md:rounded-bl-[0] md:rounded-br-[500px] md:rounded-tr-[40%] -left-[50%] md:-left-0"
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center w-full max-w-7xl mx-auto px-10 py-24">
        {/* Left Text Content */}
        <div className="w-full md:w-1/2 text-white pr-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Welcome to <span className="text-[#f9f9fc]">NeuroFlow</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            Track your <strong>mood</strong>, improve your{" "}
            <strong>productivity</strong>, and take control of your mental
            wellness with NeuroFlow.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              className="bg-white text-indigo-800 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-indigo-100 transition"
              onClick={() => {
                navigate("/journal");
              }}
            >
              {" "}
              Start Tracking{" "}
            </button>
          </div>
        </div>

        {/* Right Animation */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="max-w-sm md:max-w-md">
            <Lottie animationData={brainAnimation} loop={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
