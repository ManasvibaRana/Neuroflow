import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Tabs Component
export const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0]);
  // Show right arrow indicator if tabs overflow
  const tabBarRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);
  useEffect(() => {
    const checkOverflow = () => {
      if (tabBarRef.current) {
        setShowArrow(tabBarRef.current.scrollWidth > tabBarRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs]);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="relative">
        <div
          ref={tabBarRef}
          className="flex gap-2 sm:gap-4 my-4 sm:my-8 overflow-x-auto scrollbar-hide justify-start items-center bg-white shadow rounded-xl sticky top-0 z-20 px-2 py-2 border border-[#bfc7e6]"
        >
          {Object.keys(tabs).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold rounded-full transition-all duration-300 tracking-wide focus:outline-none focus:ring-2 focus:ring-[#a78bfa] border-2 ${
                activeTab === key
                  ? "bg-[#796fc1] text-white shadow border-[#a78bfa]"
                  : "bg-white text-[#796fc1] border-[#bfc7e6] hover:bg-[#f3e8ff]"
              }`}
              style={{ minWidth: '120px' }}
            >
              {key}
            </button>
          ))}
          {/* Right arrow indicator for scrollable tabs */}
          {showArrow && (
            <span className="ml-2 text-[#a78bfa] text-2xl select-none hidden sm:inline-block">→</span>
          )}
        </div>
        {/* Mobile arrow indicator (always show if overflow) */}
        {showArrow && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 pointer-events-none block sm:hidden">
            <span className="text-[#a78bfa] text-2xl select-none">→</span>
          </div>
        )}
      </div>
      {/* Tab Content with animation */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {tabs[activeTab]}
      </motion.div>
    </div>
  );
};

// Card Wrapper
export const Card = ({ children }) => (
  <div className="rounded-2xl shadow-md border p-4 bg-white dark:bg-zinc-200">
    {children}
  </div>
);

// Card Content Block
export const CardContent = ({ children }) => (
  <div className="mt-2">{children}</div>
);
