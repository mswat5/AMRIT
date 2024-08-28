import { Link } from "react-scroll";
import Socials from "./components/Socials";

export default function Footer() {
  const links = [
    { id: "features", text: "Features" },
    { id: "about", text: "About Us" },
    { id: "contact", text: "Contact Us" },
    { id: "faqs", text: "FAQs" },
  ];

  return (
    <footer className="bg-white text-gray-800 font-bold py-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 justify-center">
        <div>
          <div className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <span className="font-bold text-3xl font-prompt">AMRIT</span>
          </div>
          <p className="text-gray-600">
            <br />© 2024 AMRIT All rights reserved.
          </p>
        </div>

        <div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul>
                {links.map((link) => (
                  <li key={link.id} className="mb-2">
                    <Link
                      to={link.id}
                      smooth={true}
                      duration={500}
                      offset={-120}
                    >
                      <button className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-300">
                        {link.text}
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Socials />
          </div>
        </div>
      </div>
    </footer>
  );
}
