import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Utility function from SHADCN or your project
import { useNavigate, useLocation } from "react-router-dom";
import { User, AlertCircle, Package, Building, FileText } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      id: "1",
      label: "Facility Details",
      path: "/facility/facility-details",
      icon: <Building />,
    },
    {
      id: "2",
      label: "Accident Management",
      path: "/facility/accident-management",
      icon: <AlertCircle />,
    },
    {
      id: "3",
      label: "Patient Management",
      path: "/facility/patient-management",
      icon: <User />,
    },
    {
      id: "4",
      label: "Resource Management",
      path: "/facility/resource-management",
      icon: <Package />,
    },

    {
      id: "5",
      label: "Reports",
      path: "/facility/reports",
      icon: <FileText />,
    },
  ];

  const [activeItem, setActiveItem] = useState(items[0].id);

  useEffect(() => {
    const currentItem = items.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  return (
    <div className="col-span-2 dark:bg-slate-900 bg-secondary h-lvh p-2 ">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "p-2 cursor-pointer rounded-md flex items-center gap-x-2 font-semibold",
              activeItem === item.id ? "bg-primary text-white" : ""
            )}
            onClick={() => handleItemClick(item)}
          >
            {item.icon}
            <p className="hidden lg:block">{item.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
