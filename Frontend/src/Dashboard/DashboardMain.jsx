import React from "react";

export default function DashboardMain() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="bg-[#e9eaff] p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-1">🔥 Current Streak</h3>
          <p className="text-3xl font-bold text-[#5762E4]">7 Days</p>
        </div>

        {/* Mood Chart Placeholder */}
        <div className="bg-[#e9eaff] p-6 rounded-xl shadow h-32 flex items-center justify-center">
          Mood Chart
        </div>

        {/* Productivity Stats */}
        <div className="bg-[#e9eaff] p-6 rounded-xl shadow h-32 flex items-center justify-center">
          Journal Stats
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#f7f8ff] p-4 rounded-lg shadow">
          ✨ Weekly Progress Graph
        </div>
        <div className="bg-[#f7f8ff] p-4 rounded-lg shadow">
          📘 Pinned Journal Entries
        </div>
      </div>
    </div>
  );
}
