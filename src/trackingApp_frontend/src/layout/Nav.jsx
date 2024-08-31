import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Building,
  FileText,
  Package,
  User,
  Menu,
  X,
  Shield,
  Car,
  Users,
  User2,
  Briefcase,
  ClipboardList,
  Phone,
  UserCheck, // New icon for Patient Management
  AlertOctagon, // New icon for Accident Management
  File, // New icon for Reports
} from "lucide-react"; // Add relevant icons
import {  useContext,useState } from "react";

import ActorContext from "../ActorContext";
const Nav = () => {
  const { actors, setActors } = useContext(ActorContext);
  const [isFacilityMenuOpen, setIsFacilityMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isInchargeMenuOpen, setIsInchargeMenuOpen] = useState(false); // New state for Incharge menu

  const navigate = useNavigate();
  const location = useLocation();

  const handleFacilityMenuClick = () => {
    setIsFacilityMenuOpen(!isFacilityMenuOpen);
  };

  const handleAdminMenuClick = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const handleInchargeMenuClick = () => {
    setIsInchargeMenuOpen(!isInchargeMenuOpen); // Toggle Incharge menu
  };

  const handleLinkClick = () => {
    setIsFacilityMenuOpen(false);
    setIsAdminMenuOpen(false);
    setIsInchargeMenuOpen(false); // Close Incharge menu on link click
  };

  const isFacilityRoute = location.pathname.startsWith("/facility");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isInchargeRoute = location.pathname.startsWith("/incharge");

  return (
    <div className="flex justify-between p-2 h-20 items-center dark:bg-slate-900 border-b">
      {!isFacilityRoute && !isAdminRoute && !isInchargeRoute ? (
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
              {isFacilityMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden fixed top-16 left-0 z-10 w-full bg-background border-b shadow-sm ${
              isFacilityMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full">
              {[
                {
                  to: "/facility/patient-management",
                  icon: <User />,
                  text: "Patient Management",
                },
                {
                  to: "/facility/accident-management",
                  icon: <AlertCircle />,
                  text: "Accident Management",
                },
                {
                  to: "/facility/resource-management",
                  icon: <Package />,
                  text: "Resource Management",
                },
                {
                  to: "/facility/facility-details",
                  icon: <Building />,
                  text: "Facility Details",
                },
                {
                  to: "/facility/reports",
                  icon: <FileText />,
                  text: "Reports",
                },
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
              {
                to: "/admin/facility-approval",
                icon: <Shield />,
                text: "Facility Approval",
              },
              {
                to: "/admin/ambulance-approval",
                icon: <Car />,
                text: "Ambulance Approval",
              },
              {
                to: "/admin/user-management",
                icon: <Users />,
                text: "User Management",
              },
              {
                to: "/admin/incharge-approval",
                icon: <User2 />,
                text: "Incharge Approval",
              }, // Renamed to match route convention
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
              {isAdminMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden fixed top-16 left-0 z-10 w-full bg-background border-b shadow-sm ${
              isAdminMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full z-50">
              {[
                {
                  to: "/admin/facility-approval",
                  icon: <Shield />,
                  text: "Facility Approval",
                },
                {
                  to: "/admin/ambulance-approval",
                  icon: <Car />,
                  text: "Ambulance Approval",
                },
                {
                  to: "/admin/user-management",
                  icon: <Users />,
                  text: "User Management",
                },
                {
                  to: "/admin/incharge-approval",
                  icon: <User2 />,
                  text: "Incharge Approval",
                }, // Renamed to match route convention
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

      {isInchargeRoute && (
        <>
          <div className="hidden md:flex space-x-4">
            {[
              {
                to: "/incharge/patient-management",
                icon: <UserCheck />, // Patient Management
                text: "Patient Management",
              },
              {
                to: "/incharge/accident-management",
                icon: <AlertOctagon />, // Accident Management
                text: "Accident Management",
              },
              {
                to: "/incharge/reports",
                icon: <File />, // Reports
                text: "Reports",
              },
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
              onClick={handleInchargeMenuClick}
            >
              {isInchargeMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden fixed top-16 left-0 z-10 w-full bg-background border-b shadow-sm ${
              isInchargeMenuOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col justify-center items-center h-full z-50">
              {[
                {
                  to: "/incharge/patient-management",
                  icon: <UserCheck />, // Patient Management
                  text: "Patient Management",
                },
                {
                  to: "/incharge/accident-management",
                  icon: <AlertOctagon />, // Accident Management
                  text: "Accident Management",
                },
                {
                  to: "/incharge/reports",
                  icon: <File />,
                  text: "Reports",
                },
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
<div className="flex items-center">
  <ModeToggle />
  <Button
    className="ml-4"
    onClick={() => {
      setActors({
        admin: null,
        report: null,
        facility: null,
        ambulance: null,
        accident: null,
        patient: null,
      });
      navigate("/register");
    }}
  >
    Logout
  </Button>
</div>
    </div>
  );
};
export default Nav;
