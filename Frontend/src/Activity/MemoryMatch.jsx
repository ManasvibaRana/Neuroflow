import React, { useState, useEffect } from "react";

const icons = ["☕", "🌿", "📚", "🎧", "💡", "🌙"];
const cardsData = icons.flatMap((icon, i) => [
  { id: i * 2, icon },
  { id: i * 2 + 1, icon },
]);

export default function MemoryMatch() {
  const [cards, setCards] = useState(
    cardsData
      .map(card => ({ ...card, flipped: false, matched: false }))
      .sort(() => 0.5 - Math.random())
  );
  const [flippedCards, setFlippedCards] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (cards.every(c => c.matched)) {
      setWon(true);
    }
  }, [cards]);

  useEffect(() => {
    if (won) {
      const timer = setTimeout(() => {
        // Reset all cards
        setCards(
          cardsData
            .map(card => ({ ...card, flipped: false, matched: false }))
            .sort(() => 0.5 - Math.random())
        );
        setFlippedCards([]);
        setWon(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [won]);

  const flip = (i) => {
    if (cards[i].flipped || cards[i].matched || flippedCards.length === 2) return;

    const newCards = [...cards];
    newCards[i].flipped = true;
    const newFlipped = [...flippedCards, i];

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (newCards[i1].icon === newCards[i2].icon) {
        newCards[i1].matched = true;
        newCards[i2].matched = true;
      } else {
        setTimeout(() => {
          newCards[i1].flipped = false;
          newCards[i2].flipped = false;
          setCards([...newCards]);
        }, 800);
      }
      setFlippedCards([]);
    } else {
      setFlippedCards(newFlipped);
    }
    setCards(newCards);
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-md text-center transition hover:scale-105">
      <h3 className="text-lg font-bold mb-4 text-purple-600">🧠 Memory Match</h3>

      {won && (
        <div className="mb-4 text-green-600 text-xl animate-bounce">
          🎉 Yay! You matched them all!
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 justify-center">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => flip(i)}
            className={`w-20 h-20 flex items-center justify-center bg-purple-200 rounded-xl cursor-pointer transform transition-transform duration-500 ${
              card.flipped || card.matched ? "rotate-y-180" : ""
            }`}
          >
            <span className="text-2xl">
              {card.flipped || card.matched ? card.icon : "❓"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
