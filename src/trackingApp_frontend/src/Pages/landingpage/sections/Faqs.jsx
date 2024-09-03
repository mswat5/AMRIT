import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "How does the Advanced Medical Response Incident Tracker work?",
    answer: (
      <p>
        The Advanced Medical Response Incident Tracker streamlines the process
        of managing and responding to medical emergencies. Our platform ensures
        rapid communication and efficient incident handling, integrating with
        various medical services for real-time updates and coordination.
      </p>
    ),
  },
  {
    question: "Is patient data secure within the Incident Tracker?",
    answer: (
      <p>
        Absolutely! The Incident Tracker employs cutting-edge encryption
        techniques to protect patient data. Our system is designed with a
        privacy-first approach, ensuring that all sensitive information remains
        secure and accessible only to authorized personnel.
      </p>
    ),
  },
  {
    question: "Can I track multiple incidents simultaneously?",
    answer: (
      <p>
        Yes, our platform is built to handle multiple incidents concurrently.
        You can monitor, update, and manage several cases at once, with a
        user-friendly interface that makes multitasking seamless.
      </p>
    ),
  },
  {
    question: "How do I share incident reports with other facilities?",
    answer: (
      <p>
        Sharing incident reports is straightforward. The platform allows you to
        securely share reports with other facilities or medical teams in
        real-time, ensuring that all involved parties have the necessary
        information for coordinated action.
      </p>
    ),
  },
  {
    question: "What insights can I gain from using the Incident Tracker?",
    answer: (
      <p>
        The Advanced Medical Response Incident Tracker provides valuable
        insights into your emergency response operations. Analyze incident
        trends, response times, and outcomes to improve future performance and
        optimize resource allocation.
      </p>
    ),
  },
];

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-12 md:py-24 px-8  ">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="py-4 text-3xl font-bold tracking-tight md:text-5xl text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white  rounded-lg ">
              <button
                className="flex justify-between w-full p-4 text-left text-lg font-medium bg-gray-100 dark:bg-gray-800 rounded-t-lg focus:outline-none hover:bg-gray-200 transition duration-300"
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                <ChevronDown
                  className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-200 ${
                    activeIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-gray-100 ${
                  activeIndex === index ? "max-h-screen p-4" : "max-h-0"
                }`}
              >
                <div className="text-gray-700 ">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faqs;
