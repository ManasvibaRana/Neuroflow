import React from "react";

export default function RightPanel() {
  return (
    <aside className="w-72 bg-white border-l p-6 hidden lg:block">
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">Upcoming Tasks</h4>
        <div className="bg-[#f1f2ff] p-3 rounded-lg shadow text-center">
          <p className="text-sm mb-2">Complete Mood Journal</p>
          <button className="bg-[#838beb] text-white text-xs px-3 py-1 rounded-full">
            Mark Done
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">Calendar</h4>
        <div className="bg-[#f1f2ff] h-40 rounded-lg flex items-center justify-center text-gray-400">
          📅 [Calendar Component Placeholder]
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-2">Previous Journals</h4>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>📝 Journal on Sleep - Jul 6</li>
          <li>📝 Mood Entry - Jul 5</li>
        </ul>
      </div>
    </aside>
  );
}
