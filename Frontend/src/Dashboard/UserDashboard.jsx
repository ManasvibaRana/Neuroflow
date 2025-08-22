import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import JournalHistory from "./JournalHistory";
import ProductivityHistory from "./ProductivityHistory";
import J1 from "../Journal/JournalForm";
// import other right-side components as needed

export default function UserDashboard() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Function to render right-side content based on selection
  const renderContent = () => {
    switch (activeComponent) {
      case "journal":
        return <JournalHistory />;
      case "productivity":
        return <ProductivityHistory />;
     
      case "dashboard":
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-[#f4f5ff] text-gray-800">
      {/* Left Sidebar */}
      <Sidebar onSelect={setActiveComponent} />

      {/* Right-side dynamic content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
