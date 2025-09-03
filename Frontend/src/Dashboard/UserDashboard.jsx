import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import JournalHistory from "./JournalHistory";
import ProductivityHistory from "./ProductivityHistory";

export default function UserDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Object to map component keys to their titles
  const componentTitles = {
    dashboard: "Welcome Back!",
    journal: "Journal History",
    productivity: "Productivity History",
  };

  // Function to render right-side content based on selection
  const renderContent = () => {
    switch (activeComponent) {
      case "journal":
        return <JournalHistory />;
      case "productivity":
        return <ProductivityHistory />;
      case "dashboard":
      default:
        return <DashboardMain />; // No longer needs setSidebarOpen
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-[#f4f5ff] text-gray-800">
      <Sidebar
        onSelect={setActiveComponent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Right-side content with a persistent header */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Persistent Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {componentTitles[activeComponent]}
          </h2>
          {/* Hamburger Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        
        {/* Render the selected component */}
        {renderContent()}
      </main>
    </div>
  );
}