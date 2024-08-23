import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import {
  ChevronRight,
  User,
  BriefcaseMedical,
  Building,
  User,
  UserRoundCheckIcon,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import Quote from "../components/Quote";
import ActorContext from "../ActorContext";
//admin ambulance facility
const Signup = () => {
  const navigate = useNavigate();
  const { actors, isAuthenticated, login } = useContext(ActorContext);

  // const [registrationStatus, setRegistrationStatus] = useState();
  const [c, setc] = useState(false);
  async function changeSigning() {
    login();
    if (isAuthenticated) {
      let resultRole = await actors.admin.getUserRole();
      console.log(resultRole);
      checkRegistration(resultRole.ok);
    }
  }
  const checkRegistration = (type) => {
    if (type === "admin") {
      navigate("/Admin/");
    } else if (type === "facility") {
      navigate("/Facility/");
    } else if (type === "ambulance") {
      navigate("/Ambulance/");
    } else if (type === "incharge") {
      navigate("/Incharge/");
    } else {
      setc(!c);
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <div className="pt-4 pl-4">
          <ModeToggle />
        </div>
        <div className="h-screen flex justify-center flex-col">
          <div className="flex justify-center">
            {c ? (
              <div>
                <div className="auth-section">
                  <Button
                    onClick={changeSigning}
                    className="mt-8 w-full  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                  >
                    Disconnect
                  </Button>
                </div>
                <p className="text-sm text-gray-500 my-4">Login/Register As</p>

                <Button
                  className="flex justify-between items-center w-full border border-gray-300 p-3 rounded-md mb-2"
                  variant="secondary"
                  onClick={() => navigate("/admin/home")}
                >
                  <div className="flex items-center">
                    <User className="text-primary" />
                    <span className="ml-2 font-bold">Admin</span>
                  </div>
                  <ChevronRight />
                </Button>
                <Button
                  className="flex justify-between items-center w-full border border-gray-300 p-3 rounded-md mb-2"
                  variant="secondary"
                  onClick={() => navigate("/incharge/home")}
                >
                  <div className="flex items-center">
                    <UserRoundCheckIcon className="text-primary" />
                    <span className="ml-2 font-bold">Incharge</span>
                  </div>
                  <ChevronRight />
                </Button>
                <Button
                  className="flex justify-between items-center w-full border border-gray-300 p-3 rounded-md mb-2"
                  variant="secondary"
                  onClick={() => navigate("/Register/ambulance")}
                >
                  <div className="flex items-center">
                    <BriefcaseMedical className="text-primary" />
                    <span className="ml-2 font-bold">Ambulance</span>
                  </div>
                  <ChevronRight />
                </Button>
                <Button
                  className="flex justify-between items-center w-full border border-gray-300 p-3 rounded-md mb-2"
                  variant="secondary"
                  onClick={() => navigate("/Register/facility")}
                >
                  <div className="flex items-center">
                    <Building className="text-primary" />
                    <span className="ml-2 font-bold">Facility</span>
                  </div>
                  <ChevronRight />
                </Button>
              </div>
            ) : (
              <div>
                <div className="px-10">
                  <div className="text-3xl font-extrabold">
                    Connect to get Started
                  </div>
                  <div className="text-slate-500">
                    Don't have internet identity?
                  </div>
                </div>
                <Button
                  onClick={changeSigning}
                  className="mt-8 w-full text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Connect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signup;
