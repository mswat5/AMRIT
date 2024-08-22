import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AlertCircle, Building, FileText, Package, User, Menu, X, Shield, Car, Users } from "lucide-react";
import { useState } from "react";

const Nav = () => {
  const [isFacilityMenuOpen, setIsFacilityMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFacilityMenuClick = () => {
    setIsFacilityMenuOpen(!isFacilityMenuOpen);
  };

  const handleAdminMenuClick = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const handleLinkClick = () => {
    setIsFacilityMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const isFacilityRoute = location.pathname.startsWith('/facility');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex justify-between p-2 items-center dark:bg-slate-900 border-b">
      {!isFacilityRoute && !isAdminRoute ? (
        <div className={"text-3xl font-bold"}>AMRIT</div>
      ) : (
        <div className={"text-3xl font-bold md:block hidden"}>AMRIT</div>
      )}

      {isFacilityRoute && (
        <>
          <div className="md:hidden">
            <button
              className="p-2 border rounded-lg"
              onClick={handleFacilityMenuClick}
            >
              {isFacilityMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className={`md:hidden fixed top-16 left-0 w-full bg-background border-b shadow-sm ${isFacilityMenuOpen ? "block" : "hidden"}`}>
            <div className="flex flex-col justify-center items-center h-full">
              {[
                { to: "/facility/item1", icon: <User />, text: "Patient Management" },
                { to: "/facility/item2", icon: <AlertCircle />, text: "Accident Management" },
                { to: "/facility/item3", icon: <Package />, text: "Resource Management" },
                { to: "/facility/item4", icon: <Building />, text: "Facility Details" },
                { to: "/facility/item5", icon: <FileText />, text: "Reports" },
              ].map((link, index) => (
                <NavLink
                  key={index}
                  onClick={handleLinkClick}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "text-foreground hover:text-primary my-2 font-semibold flex items-center gap-x-2",
                      isActive ? "text-primary" : ""
                    )
                  }
                >
                  {link.icon}
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}

      {isAdminRoute && (
        <>
          <div className="hidden md:flex space-x-4">
            {[
              { to: "/admin/facility-approval", icon: <Shield />, text: "Facility Approval" },
              { to: "/admin/ambulance-approval", icon: <Car />, text: "Ambulance Approval" },
              { to: "/admin/user-management", icon: <Users />, text: "User Management" },
            ].map((link, index) => (
              <NavLink
                key={index}
                onClick={handleLinkClick}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "text-foreground hover:text-primary mx-2 font-semibold flex items-center gap-x-2",
                    isActive ? "text-primary" : ""
                  )
                }
              >
                {link.icon}
                {link.text}
              </NavLink>
            ))}
          </div>

          <div className="md:hidden">
            <button
              className="p-2 border rounded-lg"
              onClick={handleAdminMenuClick}
            >
              {isAdminMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className={`md:hidden fixed top-16 left-0 w-full bg-background border-b shadow-sm ${isAdminMenuOpen ? "block" : "hidden"}`}>
            <div className="flex flex-col justify-center items-center h-full">
              {[
                { to: "/admin/facility-approval", icon: <Shield />, text: "Facility Approval" },
                { to: "/admin/ambulance-approval", icon: <Car />, text: "Ambulance Approval" },
                { to: "/admin/user-management", icon: <Users />, text: "User Management" },
              ].map((link, index) => (
                <NavLink
                  key={index}
                  onClick={handleLinkClick}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "text-foreground hover:text-primary my-2 font-semibold flex items-center gap-x-2",
                      isActive ? "text-primary" : ""
                    )
                  }
                >
                  {link.icon}
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex space-x-4">
        <ModeToggle />
        <Button
          onClick={() => navigate("/Register")}
          className="w-full text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default Nav;