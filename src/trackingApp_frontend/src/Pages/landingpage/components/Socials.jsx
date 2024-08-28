import { Instagram, Linkedin } from "lucide-react";

const Socials = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Follow Amrit</h3>
      <div className="flex space-x-4">
        {/* Instagram */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-500 hover:bg-indigo-600 w-10 h-10 p-2 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <Instagram className="text-white h-5 w-5" />
        </a>

        {/* LinkedIn */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-500 hover:bg-indigo-600 w-10 h-10 p-2 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <Linkedin className="text-white h-5 w-5" />
        </a>

        {/* Custom Icon */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-500 hover:bg-indigo-600 w-10 h-10 p-2 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <svg
            role="img"
            fill="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <title>Custom Icon</title>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        </a>

        {/* Telegram */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-500 hover:bg-indigo-600 w-10 h-10 p-2 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <svg
            role="img"
            fill="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <title>Telegram</title>
            <path d="M12 0C5.372 0 0 5.372 0 12c0 6.628 5.372 12 12 12s12-5.372 12-12C24 5.372 18.628 0 12 0zm6.176 8.46l-2.324 11.052c-.176.804-.632.988-1.276.616l-3.528-2.602-1.701 1.639c-.188.188-.348.348-.708.348l.252-3.524 6.404-5.764c.28-.252-.06-.392-.44-.14l-7.92 5.004-3.4-1.06c-.748-.232-.764-.748.156-1.108L17.1 7.312c.656-.264 1.224.148 1.076 1.148z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Socials;
