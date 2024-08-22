const UserManagement = () => {
  // Dummy data for demonstration; in a real application, you would fetch this data from an API
  const totalUsers = 100;
  const totalAmbulances = 20;
  const totalFacilities = 15;

  return (
    <div className="p-4 h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="space-y-4">
        <div className="p-4 bg-slate-400 dark:bg-slate-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-lg">{totalUsers}</p>
        </div>
        <div className="p-4 bg-slate-400 dark:bg-slate-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Ambulances</h2>
          <p className="text-lg">{totalAmbulances}</p>
        </div>
        <div className="p-4 bg-slate-400 dark:bg-slate-900 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Total Facilities</h2>
          <p className="text-lg">{totalFacilities}</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;