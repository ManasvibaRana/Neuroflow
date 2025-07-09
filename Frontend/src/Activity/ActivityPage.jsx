import React from "react";
import BrainTeaser from "./BrainTeaser";
import MemoryMatch from "./MemoryMatch";
import Navbar from "../Navbar";
import NumberFocus from "./NumberFocus";
import QuickReaction from "./QuickReaction";
import TypingBurst from "./TypingBurst";

export default function ActivityPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-purple-700">
        🌿 Neuroflow Mind Gym
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <TypingBurst/>
        <MemoryMatch />
        <NumberFocus/>
        <QuickReaction/>
        <BrainTeaser />
       
      </div>
    </div>
    </>
  );
}
