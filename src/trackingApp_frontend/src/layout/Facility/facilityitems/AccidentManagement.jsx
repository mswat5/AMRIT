import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ReportAccident from "../accidentManagement/reportAccident";
import AccidentReported from "../accidentManagement/accidentReported";
import ActiveAccidents from "../accidentManagement/activeAccidents";
import AccidentTimeline from "../accidentManagement/accidentTimeline";
import UpdateAccidentStatus from "../accidentManagement/updateAccidentStatus";
import { ViewContext } from "../../../ActorContext";
import { useContext } from "react";

const InchargeAccidentManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { view, setView } = useContext(ViewContext);

  const handleCardClick = (form) => {
    navigate(`${form}`, { state: { formType: form } });
    setView("form");
  };

  const handleBackClick = () => {
    navigate("accident-management");
    setView("cards");
  };

  return (
    <div className="">
      {view === "cards" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Accident Management</h2>
          <div className="space-y-4">
            <div
              onClick={() => handleCardClick("report-accident")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Report Accident
            </div>
            <div
              onClick={() => handleCardClick("accident-reported")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Accidents Reported by Your Facility
            </div>
            <div
              onClick={() => handleCardClick("active-accidents")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              List of Active Accidents
            </div>
            <div
              onClick={() => handleCardClick("accident-timeline")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Accident Timeline
            </div>
            <div
              onClick={() => handleCardClick("update-accident-status")}
              className="block p-4 bg-gray-200 rounded-md cursor-pointer"
            >
              Update Accident Status
            </div>
          </div>
        </div>
      )}

      {view === "form" && (
        <div>
          <button
            onClick={handleBackClick}
            className="block p-2 pl-4 text-black rounded-md mb-4  gap-x-4 font-semibold text-xl"
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
  const location = useLocation();
  const formType = location.state?.formType;

  console.log("Form type:", formType);
  console.log("Current pathname:", location.pathname);

  switch (formType) {
    case "report-accident":
      return <ReportAccident />;
    case "accident-reported":
      return <AccidentReported />;
    case "active-accidents":
      return <ActiveAccidents />;
    case "accident-timeline":
      return <AccidentTimeline />;
    case "update-accident-status":
      return <UpdateAccidentStatus />;
    default:
      return <div>Form not found</div>;
  }
};

export default InchargeAccidentManagement;
