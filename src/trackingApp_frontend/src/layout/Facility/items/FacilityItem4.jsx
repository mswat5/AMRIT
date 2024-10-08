import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FacilityInfo from '../facilityDetails/info';
import UpdateFacilityInfo from '../facilityDetails/updateInfo';
import FindNearestFacility from '../facilityDetails/findNearest';

const FacilityItem4 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState('cards');

  const handleCardClick = (form) => {
    navigate(`${form}`, { state: { formType: form } });
    setView('form');
  };

  const handleBackClick = () => {
    navigate('item4');
    setView('cards');
  };

  return (
    <div className="">
      {view === 'cards' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Facility Information</h2>
          <div className="space-y-4">
            <div onClick={() => handleCardClick('info')} className="block p-4 bg-gray-200 rounded-md cursor-pointer">Facility Info</div>
            <div onClick={() => handleCardClick('update-info')} className="block p-4 bg-gray-200 rounded-md cursor-pointer">Update Facility Info</div>
            <div onClick={() => handleCardClick('find-nearest')} className="block p-4 bg-gray-200 rounded-md cursor-pointer">Find Nearest Facility</div>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div>
          <button onClick={handleBackClick} className="block p-2 pl-4 text-black rounded-md mb-4 flex gap-x-4 font-semibold text-xl">
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

  console.log('Form type:', formType);
  console.log('Current pathname:', location.pathname);

  switch (formType) {
    case 'info':
      return <FacilityInfo />;
    case 'update-info':
      return <UpdateFacilityInfo />;
    case 'find-nearest':
      return <FindNearestFacility />;
    default:
      return <div>Form not found</div>;
  }
};

export default FacilityItem4;