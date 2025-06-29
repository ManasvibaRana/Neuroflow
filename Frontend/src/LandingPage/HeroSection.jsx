import React from "react";
import Lottie from "lottie-react";
import brainAnimation from "../LandingPage/Images/brain.json";

function HeroSection() {
  return (
    <section
      className="relative w-full min-h-screen flex items-center bg-white overflow-hidden"
      id="Home"
    >
      {/* Left Purple Background Half */}
      <div
        className="absolute inset-y-0 md:w-[55%] w-[200%] bg-gradient-to-br from-[#796fc1] to-[#838beb] z-0 
      rounded-b-[700px] md:rounded-bl-[0] md:rounded-br-[500px] md:rounded-tr-[40%] -left-[50%] md:-left-0"
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center w-full max-w-7xl mx-auto ml-4 px-10 py-28 md:py-36">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-white pr-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The World's First <br />
            Intelligent Journal
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            NeuroFlow is a journal utilizing AI to help you reflect on your
            thoughts and track your mental health.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="#"
              className="bg-white text-indigo-800 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-indigo-100 transition"
            >
              Start Tracking
            </a>
            <a
              href="#features"
              className="text-white underline font-medium hover:text-indigo-200"
            >
              Learn More
            </a>
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
