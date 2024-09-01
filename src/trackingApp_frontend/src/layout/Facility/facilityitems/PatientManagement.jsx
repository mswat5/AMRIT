import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AdmitPatient from "../patientManagement/admit";
import Discharge from "../patientManagement/discharge";
import Transfer from "../patientManagement/transfer";
import GetPatientDetails from "../patientManagement/details";
import UpdatePatientStatus from "../patientManagement/updateStatus";
import { ViewContext } from "../../../ActorContext";
import { useContext } from "react";

const PatientManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { view, setView } = useContext(ViewContext);

  const handleCardClick = (form) => {
    navigate(`${form}`);
    setView("form");
  };

  const handleBackClick = () => {
    navigate("patient-management");
    setView("cards");
  };

  return (
    <div>
      {view === "cards" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Patient Management</h2>
          <div className="space-y-4">
            <div
              onClick={() => handleCardClick("admit")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Admit Patient
            </div>
            <div
              onClick={() => handleCardClick("discharge")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Discharge
            </div>
            <div
              onClick={() => handleCardClick("transfer")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Transfer to Another Facility
            </div>
            <div
              onClick={() => handleCardClick("details")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Get Patient Details
            </div>

            <div
              onClick={() => handleCardClick("update-status")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Update Patient Status
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
