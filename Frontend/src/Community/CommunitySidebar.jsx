// Frontend/src/CommunitySidebar.jsx
"use client";

import React from "react";
import { Shuffle, Lightbulb, ArrowDownWideNarrow, Smile, Cloud, Leaf, Moon, Sparkles } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { classNames } from './Utils';

const moodOptions = [
  { icon: Smile, name: "Content" },
  { icon: Cloud, name: "Peaceful" },
  { icon: Leaf, name: "Growth" },
  { icon: Moon, name: "Reflective" },
  { icon: Sparkles, name: "Joyful" },
];

export default function CommunitySidebar({ moodOptions, filterMood, setFilterMood, sortBy, setSortBy, onDiscoverRandomPost }) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 pb-4">
          <Lightbulb className="w-5 h-5 text-[#838beb]" /> Trending Moods
        </h2>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            return (
              <span
                key={mood.name}
                className={classNames(
                  "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200",
                  filterMood === mood.name
                    ? "bg-[#838beb] text-white hover:bg-[#6e68bd]"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => setFilterMood(filterMood === mood.name ? null : mood.name)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {mood.name}
              </span>
            );
          })}
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 pb-4">
          <Shuffle className="w-5 h-5 text-[#838beb]" /> Explore & Sort
        </h2>
        <div className="space-y-4">
          <button
            onClick={onDiscoverRandomPost}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[#6e68bd] border border-[#a2a8e8] bg-[#f3f4ff] hover:bg-[#e7eaf7] transition-colors duration-200 font-medium"
          >
            <Shuffle className="w-4 h-4" />
            Discover a Random Post
          </button>
          <CustomDropdown
            label={`Sort by: ${sortBy === "newest" ? "Newest" : "Total Reactions"}`}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Total Reactions", value: "total_reactions" },
            ]}
            onSelect={(value) => setSortBy(value)}
            icon={<ArrowDownWideNarrow className="w-4 h-4" />}
          />
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#f3f4ff] to-[#e7eaf7] shadow-lg rounded-xl p-6 text-center">
        <h3 className="font-bold text-lg mb-2 text-[#6e68bd]">Daily Neuroflow Tip</h3>
        <p className="text-sm text-gray-700 italic">
          "Breathe in peace, breathe out worry. Your mind is a garden, cultivate it with care."
        </p>
        <p className="text-xs text-gray-500 mt-2">- Neuroflow Wisdom</p>
      </div>
    </div>
  );
}