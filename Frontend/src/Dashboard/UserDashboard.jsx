import React from "react";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import RightPanel from "./RightPanel";

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-[#f4f5ff] text-gray-800">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <DashboardMain />
      </main>

      {/* Right Panel */}
      <RightPanel />
    </div>
  );
}
