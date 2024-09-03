import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="  p-6 rounded-lg ">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 dark:text-white font-medium"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 dark:text-white font-medium"
            >
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 dark:text-white font-medium"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 dark:text-white font-medium"
          >
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 border-gray-300 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
