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
import admitpatientpic from "../../../assets/images/admitpatientpic.jpg";

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => handleCardClick("report-accident")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Report Accident
              </div>
            </div>
            <div
              onClick={() => handleCardClick("accident-reported")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Accidents Reported by Your Facility
              </div>
            </div>
            <div
              onClick={() => handleCardClick("active-accidents")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                List of Active Accidents
              </div>
            </div>
            <div
              onClick={() => handleCardClick("accident-timeline")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Accident Timeline
              </div>
            </div>
            <div
              onClick={() => handleCardClick("update-accident-status")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Update Accident Status
              </div>
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
