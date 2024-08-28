import React from "react";
import ambulanceImage from "./ambulance.jpg"; // Import the image

const Hero = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${ambulanceImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
      {/* Overlay */}
      <div className="relative text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Advanced Medical Response
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Streamlining emergency medical responses with cutting-edge technology.
        </p>
        <a
          href="#about" // Anchor to the About section
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg text-lg font-medium"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};

export default Hero;
