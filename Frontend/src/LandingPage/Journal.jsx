import React, { useEffect, useRef, useState } from "react";

import main1 from "./Images/main-1.jpg";
import s12 from "./Images/side-12.jpg";
import s13 from "./Images/side-13.jpg";
import main2 from "./Images/main-2.jpg";
import s22 from "./Images/side-22.jpg";
import s33 from "./Images/side-33.jpg";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  // Track scroll position for parallax effect
  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer to trigger fade-in/lift
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Common scroll lift effect
  const getImageTransform = () => `translateY(${offsetY * 0.08}px)`;

  return (


    <div id="About"
      ref={sectionRef}
      className={`bg-[#f9f9fc] w-full flex flex-col items-center justify-center px-6 md:px-16 pt-10 pb-40 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
    >
      <h1 className="text-4xl font-semibold mb-10 text-gray-800">
        How NeuroFlow works:
      </h1>

      {/* Step 1 */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap- md:gap-4 mb-10">
        {/* Left Text */}
        <div className="flex-1 flex items-center justify-center order-1 md:order-1 px-4 md:px-10">
          <div className="flex items-center gap-2 text-xl max-w-md text-center md:text-left pt-10 md:pt-24">
            <div className="w-12 h-9 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
              1
            </div>
            <p className="font-semibold text-gray-800 pl-4">
              Write your mood, get instant emotional insights.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center order-2 md:order-1 px-4 md:px-10 relative overflow-hidden">
          <div className="relative w-fit flex items-center justify-center">
            {/* Main Image with scroll effect */}
            <img
              src={main1}
              alt="main phone"
              className="w-[300px] rounded-xl shadow-xl z-10 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
            {/* Left Floating Image with scroll effect */}
            <img
              src={s12}
              alt="left card"
              className="absolute left-[-60px] top-1/5 -translate-y-1/2 w-24 h-24 rounded-xl shadow-lg z-20 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
            {/* Right Floating Image with scroll effect */}
            <img
              src={s13}
              alt="right card"
              className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-24 rounded-xl shadow-lg z-20 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
          </div>

          {/* Aura-style gradient shadow layer */}
          <div
            className="absolute bottom-[-30px] left-0 w-full h-20 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
            }}
          ></div>

          {/* Divider line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-30" />
        </div>
      </div>

      {/* Step 2 */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-5 md:gap-4">
        {/* Left Image */}
        <div className="flex-1 flex justify-center order-2 md:order-1 px-4 md:px-10 relative overflow-hidden">
          <div className="relative w-fit flex items-center justify-center">
            {/* Main Image with scroll effect */}
            <img
              src={main2}
              alt="main phone"
              className="w-[300px] rounded-xl shadow-xl z-10 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
            {/* Left Floating Image with scroll effect */}
            <img
              src={s22}
              alt="left card"
              className="absolute left-[-60px] top-1/3 -translate-y-1/2 w-24 rounded-xl shadow-lg z-20 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
            {/* Right Floating Image with scroll effect */}
            <img
              src={s33}
              alt="right card"
              className="absolute right-[-70px] top-56 -translate-y-1/2 w-24 h-24 rounded-xl shadow-lg z-20 transition-transform duration-300 ease-out"
              style={{
                transform: getImageTransform(),
              }}
            />
          </div>

          {/* Aura-style gradient shadow layer */}
          <div
            className="absolute bottom-[-30px] left-0 w-full h-20 z-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
            }}
          ></div>

          {/* Divider line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200 z-30" />
        </div>

        {/* Right Text */}
        <div className="flex-1 flex items-center justify-center order-1 md:order-2 px-4 md:px-10">
          <div className="flex items-center gap-2 text-xl max-w-md text-center md:text-left pt-10 md:pt-24">
            <div className="w-12 h-9 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
              2
            </div>
            <p className="font-semibold text-gray-800 pl-4">
              Track productivity and spot mood-based patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
