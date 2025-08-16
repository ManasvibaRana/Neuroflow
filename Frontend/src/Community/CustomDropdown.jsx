// Frontend/src/CustomDropdown.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { classNames } from "./Utils";

export default function CustomDropdown({ label, options, onSelect, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-full">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-[#6e68bd] border border-[#a2a8e8] bg-[#f3f4ff] hover:bg-[#e7eaf7] transition-colors duration-200 font-medium"
      >
        {icon}
        {typeof label === 'string' ? <span>{label}</span> : label}
        <ChevronDown className={classNames("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div ref={dropdownRef} className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-100 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}