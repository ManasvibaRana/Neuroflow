// adjust path if needed

const reviewsTop = [
  {
    name: "Aanya",
    text: "This app changed my mindset. I feel calmer every day.",
  },
  { name: "Rahul", text: "The anime quotes just hit differently! 😄" },
  { name: "Neha", text: "I track my productivity daily now. It's addictive." },
  { name: "Arjun", text: "Simple, elegant, and super useful." },
  { name: "Sneha", text: "Loved how the journaling feels personal." },
];

const reviewsBottom = [
  { name: "Kavya", text: "My daily mood check-ins are so easy now!" },
  { name: "Rishi", text: "Seeing my trends helped me avoid burnout." },
  { name: "Diya", text: "This app is the mental health buddy I needed." },
  { name: "Kabir", text: "Love how everything is personalized." },
  {
    name: "Aanya",
    text: "This app changed my mindset. I feel calmer every day.",
  },
];

export default function AutoScrollReview() {
  return (
    <>
      <div className="py-12 bg-[#838beb]/30 relative">
        <h2
          className="text-3xl font-semibold text-center text-gray-800 mb-10"
          id="Review"
        >
          Here's what people are saying...
        </h2>
        {/* Fade Effect Left */}
        <div className="absolute top-0 left-0 w-28 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Fade Effect Right */}
        <div className="absolute top-0 right-0 w-28 h-full bg-gradient-to-l from-[#838beb]/50 to-transparent z-10 pointer-events-none" />

        {/* Scroll Row 1 */}
        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-scroll px-4 whitespace-nowrap">
            {[...reviewsTop, ...reviewsTop].map((review, i) => (
              <div
                key={`top-${i}`}
                className="bg-white shadow-md rounded-xl px-6 py-4 mx-2 min-w-[280px] max-w-sm 
            flex-shrink-0 overflow-hidden break-words border-2 border-[#838beb]/50"
              >
                <p className="text-gray-700 italic mb-2 text-sm leading-relaxed line-clamp-5">
                  “{review.text}”
                </p>
                <span className="text-gray-900 font-medium text-sm">
                  - {review.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Row 2 */}
        <div className="w-full overflow-hidden mt-3">
          <div className="flex w-max animate-scroll-reverse px-4 whitespace-nowrap">
            {[...reviewsBottom, ...reviewsBottom].map((review, i) => (
              <div
                key={`bottom-${i}`}
                className="bg-white shadow-md rounded-xl px-6 py-4 mx-2 min-w-[280px] max-w-sm 
            flex-shrink-0 overflow-hidden break-words border-2 border-[#838beb]/50"
              >
                <p className="text-gray-700 italic mb-2 text-sm leading-relaxed line-clamp-5">
                  “{review.text}”
                </p>
                <span className="text-gray-900 font-medium text-sm">
                  - {review.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
