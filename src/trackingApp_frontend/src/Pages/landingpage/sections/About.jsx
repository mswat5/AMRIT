import React from "react";
import ambulanceImg from "./ambulance.jpg";

const About = () => {
  return (
    <section id="about" className="py-12 md:py-24 px-8 ">
      <div className="container mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            About Advanced Medical Response Incident Tracker
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-gray-600">
            The Advanced Medical Response Incident Tracker is designed to
            revolutionize how medical facilities manage and respond to
            emergencies. Our platform integrates seamlessly with various
            healthcare services, ensuring that critical information is shared
            quickly and accurately. Whether you're managing multiple incidents
            or coordinating with other facilities, our system is built to
            optimize response times and improve patient outcomes.
          </p>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={ambulanceImg}
              alt="Ambulance"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 text-gray-700">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Our Mission
            </h2>
            <p className="mb-6">
              Our mission is to enhance the efficiency and effectiveness of
              medical emergency responses by providing a robust platform that
              streamlines communication, data sharing, and incident management.
              We are committed to empowering healthcare professionals with the
              tools they need to save lives and improve patient care.
            </p>
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Why Choose Us?
            </h2>
            <p>
              The Advanced Medical Response Incident Tracker offers a unique
              combination of real-time updates, comprehensive data analysis, and
              secure data handling. Our platform is designed with both
              healthcare providers and patients in mind, ensuring that every
              emergency is handled with precision and care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
