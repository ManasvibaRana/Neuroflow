// Frontend/src/NewPostForm.jsx
"use client";

import React, { useState } from "react";
import { Smile, Cloud, Leaf, Moon, Sparkles } from "lucide-react";
import { classNames } from "./Utils";

const moodOptions = [
  { icon: Smile, name: "Content" },
  { icon: Cloud, name: "Peaceful" },
  { icon: Leaf, name: "Growth" },
  { icon: Moon, name: "Reflective" },
  { icon: Sparkles, name: "Joyful" },
];

export default function NewPostForm({ onNewPost }) {
  const [postContent, setPostContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewPost(postContent, selectedMood?.icon, selectedMood?.name);
    setPostContent("");
    setSelectedMood(undefined);
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl p-6 relative z-10">
      <h2 className="text-xl font-semibold text-gray-800 pb-3">What's on your mind today?</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Share your thoughts, feelings, or a moment of calm..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={4}
          className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c3c8eb] resize-none text-gray-800"
        />
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            return (
              <button
                key={mood.name}
                type="button"
                onClick={() => setSelectedMood(selectedMood?.name === mood.name ? undefined : mood)}
                className={classNames(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedMood?.name === mood.name
                    ? "bg-[#838beb] text-white hover:bg-[#6e68bd]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100",
                )}
              >
                <Icon className="w-4 h-4" />
                {mood.name}
              </button>
            );
          })}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-md bg-[#838beb] hover:bg-[#6e68bd] text-white font-medium transition-colors duration-200"
        >
          Post to Community
        </button>
      </form>
    </div>
  );
}