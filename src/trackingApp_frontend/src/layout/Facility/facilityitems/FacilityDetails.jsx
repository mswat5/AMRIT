import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import FacilityInfo from "../facilityDetails/info";
import FindNearestFacility from "../facilityDetails/findNearest";
import { ViewContext } from "../../../ActorContext";
import { useContext } from "react";
import admitpatientpic from "../../../assets/images/admitpatientpic.jpg";

const FacilityDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { view, setView } = useContext(ViewContext);

  const handleCardClick = (form) => {
    navigate(`${form}`, { state: { formType: form } });
    setView("form");
  };

  const handleBackClick = () => {
    navigate("facility-details");
    setView("cards");
  };

  return (
    <div className="">
      {view === "cards" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Facility Information</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => handleCardClick("info")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Facility Info
              </div>
            </div>

            <div
              onClick={() => handleCardClick("find-nearest")}
              className="font-bold text-xl bg-gray-800 rounded-xl cursor-pointer flex md:flex-col justify-between items-center gap-y-4 p-4 shadow-md transition-transform transform hover:scale-105"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={admitpatientpic} // Same image for all cards
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
                />
              </div>
              <div className="text-white min-w-fit text-center">
                Find Nearest Facility
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
  const location = useLocation();
  const formType = location.state?.formType;

  console.log("Form type:", formType);
  console.log("Current pathname:", location.pathname);

  switch (formType) {
    case "info":
      return <FacilityInfo />;
    case "update-info":
      return <UpdateFacilityInfo />;
    case "find-nearest":
      return <FindNearestFacility />;
    default:
      return <div>Form not found</div>;
  }
};

export default FacilityDetails;
