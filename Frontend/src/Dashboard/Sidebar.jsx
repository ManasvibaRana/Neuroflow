import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onSelect }) {
  const userid = sessionStorage.getItem("userid") || "User";
  const navigate = useNavigate();

  // Map button labels to component keys
  const menuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Journal Stats", key: "journal" },
    { label: "Productivity", key: "productivity" },

    
  ];

  return (
    <aside className="w-64 bg-[#838beb] text-white p-6 flex flex-col items-center rounded-r-3xl">
      <img
        src={`https://ui-avatars.com/api/?name=${userid}&background=fff&color=838beb&size=128`}
        className="rounded-full w-28 h-28 mb-4"
        alt="profile"
      />
      <h2 className="text-xl font-semibold">{userid}</h2>
      <p className="text-sm opacity-80 mb-4">
        {userid.toLowerCase()}@neuroflow.app
      </p>

      {/* Sidebar Menu */}
      <div className="space-y-3 w-full mt-4">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)} // trigger page change
            className="w-full text-left px-4 py-2 hover:bg-[#5762E4] hover:text-white rounded-md"
          >
            {item.label}
          </button>

        ))}

          <button className="w-full text-left px-4 py-2 hover:bg-[#5762E4] hover:text-white rounded-md" onClick={() => navigate("/journal")}>Home Page </button>

      </div>

      {/* Logout */}
      <button
        onClick={() => {
          sessionStorage.clear();
          window.location.href = "/";
        }}
        className="mt-auto bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
      >
        Logout
      </button>
    </aside>
  );
}
