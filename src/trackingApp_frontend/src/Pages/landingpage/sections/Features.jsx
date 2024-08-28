import React from "react";
import { Shield, Globe, HeartPulse, Layers } from "lucide-react"; // Example icons

const featuresData = [
  {
    icon: <Shield className="w-8 h-8 text-indigo-600" />,
    title: "Unmatched Security",
    description:
      "State-of-the-art encryption protects sensitive data, ensuring its privacy and security at all times.",
  },
  {
    icon: <Globe className="w-8 h-8 text-indigo-600" />,
    title: "Global Accessibility",
    description:
      "Access and manage your health data from anywhere in the world, anytime you need it.",
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-indigo-600" />,
    title: "Real-time Monitoring",
    description:
      "Stay updated with real-time monitoring of critical health indicators, available 24/7.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-600" />,
    title: "Comprehensive Analytics",
    description:
      "In-depth analytics provide insights into trends and potential health risks, tailored to your data.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Key Features
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mt-4">
            Discover the innovative features that make our solution stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md text-center hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
