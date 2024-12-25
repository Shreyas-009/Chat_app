import React, { useState } from "react";

const WhyChooseUs = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const handleCardInteraction = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const cardContents = [
    {
      title: "Security First",
      description:
        "End-to-end encryption and robust security measures to protect your conversations.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Real-time Experience",
      description:
        "Instant messaging with live typing indicators and message status updates.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      title: "Team Collaboration",
      description:
        "Powerful group features for effective team communication and management.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 bg-zinc-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-8 ">
          {cardContents.map((content, index) => (
            <div
              key={index}
              className="relative w-full h-[250px] [perspective:1000px] hover:scale-[102%] transition-transform duration-300"
              onMouseEnter={() => handleCardInteraction(index)}
              onMouseLeave={() => handleCardInteraction(index)}
            >
              <div
                className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
                  flippedCards[index] ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Front of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] bg-purple-600 text-white rounded-lg flex flex-col items-center justify-center p-6">
                  <div className="mb-4">{content.icon}</div>
                  <h3 className="text-lg font-bold">{content.title}</h3>
                </div>

                {/* Back of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-purple-600 text-white rounded-lg flex items-center justify-center p-6 ">
                  <p className="text-xl text-center">{content.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
