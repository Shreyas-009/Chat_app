import React, { forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WhyChooseUs from "../Components/Miscellaneous/WhyChooseUs";

const CategorySection = ({ title, items, onClick }) => (
  <div
    className="w-full group cursor-pointer transform hover:scale-[1.01] transition-transform"
    onClick={onClick}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-purple-500 transform group-hover:translate-x-2 transition-transform"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="p-3 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-purple-600 hover:text-white transition-colors"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

const FlipCard = ({ title, description, icon }) => (
  <div className="w-full h-64 group perspective hover:scale-105 transition-transform">
    <div className="relative w-full h-full transition-transform duration-500 transform group-hover:[transform:rotateY(180deg)] preserve-3d">
      <div className="absolute w-full h-full backface-hidden bg-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center">
        <div className="text-purple-500 mb-4 text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      </div>
      <div className="absolute w-full h-full backface-hidden bg-purple-600 rounded-xl p-6 flex items-center justify-center [transform:rotateY(180deg)]">
        <p className="text-white text-center">{description}</p>
      </div>
    </div>
  </div>
);

const FeaturesSection = forwardRef(({ onFeatureClick }, ref) => {
  const features = [
    {
      title: "Real-time Chat",
      items: [
        "Instant Messaging",
        "Message Status",
        "Typing Indicators",
        "Read Receipts",
        "Push Notifications",
      ],
      onClick: onFeatureClick,
    },
    {
      title: "Group Features",
      items: [
        "Create Groups",
        "Add Members",
        "Remove Members",
        "Admin Controls",
        "Group Settings",
      ],
      onClick: onFeatureClick,
    },
    {
      title: "Security",
      items: [
        "End-to-End Encryption",
        "User Authentication",
        "Secure Storage",
        "Privacy Controls",
        "Data Protection",
      ],
      onClick: onFeatureClick,
    },
  ];

  return (
    <div ref={ref} className="w-full bg-zinc-900/50 py-20">
      <div className="container mx-auto px-4">
        <div className="w-full flex flex-col gap-12">
          {features.map((category, index) => (
            <React.Fragment key={category.title}>
              {index > 0 && <div className="w-full h-px bg-zinc-700" />}
              <CategorySection
                title={category.title}
                items={category.items}
                onClick={category.onClick}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});

const HomePage = () => {
  const featuresRef = useRef(null);
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-zinc-900/20" />
        <div
          className={`container mx-auto text-center transform transition-all duration-1000`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 animate-gradient">
            Connect & Chat
          </h1>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Experience the next generation of messaging with our powerful
            real-time chat platform.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={scrollToFeatures}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
            >
              Explore Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 animate-bounce"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full font-medium transform hover:scale-105 transition-all duration-300"
            >
              Try App Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection ref={featuresRef} />

      {/* Flip Cards Section */}
      <WhyChooseUs />

      {/* Footer */}
      <footer className="bg-zinc-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Connect & Chat
          </h3>
          <p className="text-zinc-400 mb-6">The next generation of messaging</p>
          <div className="flex justify-center">
            <a
              href="https://www.linkedin.com/in/shreyas-tungar-23878a252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              className="text-zinc-400 hover:text-purple-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

// import React, { forwardRef, useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AnimatedCount = ({ end, duration = 2000 }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let startTime;
//     const animate = (currentTime) => {
//       if (!startTime) startTime = currentTime;
//       const progress = (currentTime - startTime) / duration;

//       if (progress < 1) {
//         setCount(Math.floor(end * progress));
//         requestAnimationFrame(animate);
//       } else {
//         setCount(end);
//       }
//     };

//     requestAnimationFrame(animate);
//   }, [end, duration]);

//   return <span>{count}</span>;
// };

// const CategorySection = ({ title, items, onClick, delay = 0 }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={sectionRef}
//       className={`w-full cursor-pointer transform hover:scale-[1.01] transition-all duration-500 opacity-0 translate-y-10 ${
//         isVisible ? "opacity-100 translate-y-0" : ""
//       }`}
//       style={{ transitionDelay: `${delay}ms` }}
//       onClick={onClick}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-2xl font-bold text-white">{title}</h3>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="w-6 h-6 text-purple-500 transform transition-transform duration-300 group-hover:translate-x-2"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <polyline points="9 18 15 12 9 6" />
//         </svg>
//       </div>
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className="p-3 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105"
//             style={{ transitionDelay: `${index * 50}ms` }}
//           >
//             {item}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Stats = () => (
//   <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
//     {[
//       { label: "Active Users", value: 10000 },
//       { label: "Messages Sent", value: 1000000 },
//       { label: "Countries", value: 150 },
//     ].map(({ label, value }) => (
//       <div key={label} className="text-center">
//         <div className="text-4xl font-bold text-purple-500 mb-2">
//           <AnimatedCount end={value} />+
//         </div>
//         <div className="text-zinc-400">{label}</div>
//       </div>
//     ))}
//   </div>
// );

// const FlipCard = ({ title, description, icon }) => (
//   <div className="w-full h-64 group perspective hover:scale-105 transition-transform duration-500">
//     <div className="relative w-full h-full transition-transform duration-500 transform preserve-3d hover:[transform:rotateY(180deg)]">
//       <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
//         <div className="text-purple-500 mb-4 text-3xl transform transition-transform duration-300 group-hover:scale-110">
//           {icon}
//         </div>
//         <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
//       </div>
//       <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 flex items-center justify-center [transform:rotateY(180deg)] shadow-lg">
//         <p className="text-white text-center">{description}</p>
//       </div>
//     </div>
//   </div>
// );

// const FeaturesSection = forwardRef(({ onFeatureClick }, ref) => {
//   const features = [
//     {
//       title: "Real-time Chat",
//       items: [
//         "Instant Messaging",
//         "Message Status",
//         "Typing Indicators",
//         "Read Receipts",
//         "Push Notifications",
//       ],
//     },
//     {
//       title: "Group Features",
//       items: [
//         "Create Groups",
//         "Add Members",
//         "Remove Members",
//         "Admin Controls",
//         "Group Settings",
//       ],
//     },
//     {
//       title: "Security",
//       items: [
//         "End-to-End Encryption",
//         "User Authentication",
//         "Secure Storage",
//         "Privacy Controls",
//         "Data Protection",
//       ],
//     },
//   ];

//   return (
//     <div ref={ref} className="w-full bg-zinc-900/50 py-20">
//       <div className="container mx-auto px-4">
//         <div className="w-full flex flex-col gap-12">
//           {features.map((category, index) => (
//             <React.Fragment key={category.title}>
//               {index > 0 && <div className="w-full h-px bg-zinc-700" />}
//               <CategorySection
//                 title={category.title}
//                 items={category.items}
//                 onClick={() => onFeatureClick(category.title)}
//                 delay={index * 200}
//               />
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// });

// const HomePage = () => {
//   const navigate = useNavigate();
//   const featuresRef = useRef(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const scrollToFeatures = () => {
//     featuresRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="min-h-screen bg-zinc-900">
//       <section className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-zinc-900/20" />
//         <div
//           className={`container mx-auto text-center transform transition-all duration-1000 ${
//             isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//           }`}
//         >
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 animate-gradient">
//             Connect & Chat
//           </h1>
//           <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
//             Experience the next generation of messaging with our powerful
//             real-time chat platform.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <button
//               onClick={scrollToFeatures}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
//             >
//               Explore Features
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-4 h-4 animate-bounce"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <polyline points="9 18 15 12 9 6" />
//               </svg>
//             </button>
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-transparent border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white px-8 py-3 rounded-full font-medium transform hover:scale-105 transition-all duration-300"
//             >
//               Try App Now
//             </button>
//           </div>
//         </div>
//       </section>

//       <Stats />
//       <FeaturesSection ref={featuresRef} />

//       <style jsx>{`
//         @keyframes gradient {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 8s ease infinite;
//         }
//         .perspective {
//           perspective: 1000px;
//         }
//         .preserve-3d {
//           transform-style: preserve-3d;
//         }
//         .backface-hidden {
//           backface-visibility: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HomePage;
