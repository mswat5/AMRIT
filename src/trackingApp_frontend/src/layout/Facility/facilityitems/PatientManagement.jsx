import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import AdmitPatient from "../patientManagement/admit";
import Discharge from "../patientManagement/discharge";
import Transfer from "../patientManagement/transfer";
import GetPatientDetails from "../patientManagement/details";
import UpdatePatientStatus from "../patientManagement/updateStatus";
import { ViewContext } from "../../../ActorContext";
import { useContext } from "react";
import admitpatientpic from "../../../assets/images/admitpatientpic.jpg";
import discharge from "../../../assets/images/discharge.jpg";
import transfer from "../../../assets/images/transfer.jpg";
import accistatus from "../../../assets/images/accistatus.jpg";
import admit from "../../../assets/images/admit.jpg";

const PatientManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { view, setView } = useContext(ViewContext);

  const handleCardClick = (form) => {
    navigate(`${form}`);
    setView("form");
  };

  const handleBackClick = () => {
    navigate("/facility/patient-management");
    setView("cards");
  };

  return (
    <div>
      {view === "cards" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Patient Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => handleCardClick("admit")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admit}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Admit Patient
              </div>
            </div>
            <div
              onClick={() => handleCardClick("discharge")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={discharge}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">Discharge</div>
            </div>
            <div
              onClick={() => handleCardClick("transfer")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={transfer}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Transfer to Another Facility
              </div>
            </div>
            <div
              onClick={() => handleCardClick("details")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Get Patient Details
              </div>
            </div>
            <div
              onClick={() => handleCardClick("update-status")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={accistatus}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Update Patient Status
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "form" && (
        <div>
          <button
            onClick={handleBackClick}
            className=" p-2 pl-4 text-black rounded-md mb-4 flex gap-x-4 font-semibold text-xl"
          >
            <ChevronLeft /> Back to Options
          </button>
          <FormSwitcher />
        </div>
      )}
    </div>
  );
};

const FormSwitcher = () => {
  const { pathname } = useLocation();
  const formType = pathname.split("/").pop(); // Extract
  switch (formType) {
    case "admit":
      return <AdmitPatient />;
    case "discharge":
      return <Discharge />;
    case "transfer":
      return <Transfer />;
    case "details":
      return <GetPatientDetails />;
    case "update-status":
      return <UpdatePatientStatus />;
    default:
      return <div>Form not found</div>;
  }
};

export default PatientManagement;
