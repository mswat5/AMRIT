import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 h-30 bg-white shadow-md border-b">
      <div className="text-3xl font-bold text-indigo-600">AMRIT</div>

      <Button
        onClick={() => navigate("register")}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        Get Started
      </Button>
    </nav>
  );
};

export default Nav;
