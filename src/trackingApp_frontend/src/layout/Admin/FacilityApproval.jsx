import FacilityApprovalTable from './FacilityApprovalTable';

const FacilityApprovalPage = () => (
  <div className="p-4 min-h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 flex flex-col items-center">
    <h1 className="text-2xl font-bold mb-4">Facility Approval</h1>
    <FacilityApprovalTable />
  </div>
);

export default FacilityApprovalPage;