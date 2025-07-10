import React from "react";

export default function Sidebar() {
  const userid = sessionStorage.getItem("userid") || "User";

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
      <button className="bg-white text-[#838beb] px-4 py-1 rounded-full text-sm font-medium mb-4">
        Edit Profile
      </button>
      <div className="space-y-3 w-full mt-4">
        {["Dashboard", "Journal Stats", "Reminders", "Settings"].map((item) => (
          <button
            key={item}
            className="w-full text-left px-4 py-2 hover:bg-[#5762E4] hover:text-white rounded-md"
          >
            {item}
          </button>
        ))}
      </div>
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
