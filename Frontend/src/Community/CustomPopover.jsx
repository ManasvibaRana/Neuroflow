// Frontend/src/CustomPopover.jsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

export default function CustomPopover({ trigger, content }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={handleClick}>
        {trigger}
      </div>
      {isOpen && (
        <div ref={popoverRef} className="absolute z-50 mt-2 left-0">
          {content}
        </div>
      )}
    </div>
  );
}