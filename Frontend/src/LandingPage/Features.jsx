function Features() {
  const featureList = [
    {
      title: "Mood & Productivity Tracker",
      desc: "Log your daily mood and productivity to spot patterns.",
      icon: "📝",
    },
    {
      title: "Emotion Analysis",
      desc: "AI analyzes journal entries to detect emotional tone.",
      icon: "🔍",
    },
    {
      title: "Visual Insights",
      desc: "Graphs showing how your mood affects your output.",
      icon: "📊",
    },
    {
      title: "Personalized Tips",
      desc: "Get custom suggestions to improve your mental well-being.",
      icon: "💡",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Features</h2>
        <p className="text-gray-600 mb-12">
          Your personal mental health companion
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featureList.map((feature, idx) => (
            <div
              key={idx}
              data-aos="fade-down"
              data-aos-delay={idx * 300}
              className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
