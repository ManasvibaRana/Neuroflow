import Lottie from "lottie-react";
import brainAnimation from "../LandingPage/Images/brain.json"; // adjust path if needed

function HeroSection() {
  return (
    <section className="bg-[#f9f9fc] min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
      {/* Text Content */}
      <div className="max-w-xl mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Welcome to <span className="text-[#796fc1]">NeuroFlow</span>
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Track your <strong>mood</strong>, improve your{" "}
          <strong>productivity</strong>, and take control of your mental
          wellness.
        </p>
        <div className="mt-8">
          <a
            href="/dashboard"
            className="bg-[#796fc1] hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transition duration-300"
          >
            Start Tracking
          </a>
          <a
            href="#features"
            className="ml-4 text-indigo-600 hover:underline font-medium"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Lottie Brain Animation */}
      <div className="w-full md:w-[400px]">
        <Lottie animationData={brainAnimation} loop={true} />
      </div>
    </section>
  );
}

export default HeroSection;
