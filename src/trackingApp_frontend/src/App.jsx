import { ThemeProvider } from "@/components/theme-provider"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FirstPageContent from "./Pages/Signup";
import RegisterAmbulance from "./Pages/reg2";
import RegisterFacility from "./Pages/reg3";
import NotFound from "./NotFound";
import AppRoute from "./layout/Admin/AppRoute";
import AppRoute2 from "./layout/Ambulance/AppRoute";
import AppRoute3 from "./layout/Facility/AppRoute";
import SharedLayout from "./layout/SharedLayout";
import FacilityItem1 from "./layout/Facility/items/FacilityItem1";
import FacilityItem2 from "./layout/Facility/items/FacilityItem2";
import FacilityItem3 from "./layout/Facility/items/FacilityItem3";
import FacilityItem4 from "./layout/Facility/items/FacilityItem4";
import FacilityItem5 from "./layout/Facility/items/FacilityItem5";
import UserManagement from "./layout/Admin/UserManagement";
import FacilityApproval from "./layout/Admin/FacilityApproval";
import AmbulanceApproval from "./layout/Admin/AmbulanceApproval";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Register" />} />
          <Route path="/Register" element={<FirstPageContent />} />
          <Route path="/Register">
            <Route path="Ambulance" element={<RegisterAmbulance />} />
            <Route path="Facility" element={<RegisterFacility />} />
          </Route>
          <Route path="/Admin/*" 
            element={
              <SharedLayout><AppRoute /></SharedLayout>
            }>
            <Route path="User-management" element={<UserManagement />} />
            <Route path="Facility-approval" element={<FacilityApproval />} />
            <Route path="Ambulance-approval" element={<AmbulanceApproval />} />
            <Route path="*" element={<Navigate to="facility-approval" />} />
          </Route>
          <Route path="/Ambulance/*" 
            element={
              <SharedLayout><AppRoute2 /></SharedLayout>
            }/>
          <Route path="/Facility/*" 
            element={
              <SharedLayout><AppRoute3 /></SharedLayout>
            }>
            <Route path="item1/*" element={<FacilityItem1 />} />
            <Route path="item2/*" element={<FacilityItem2 />} />
            <Route path="item3/*" element={<FacilityItem3 />} />
            <Route path="item4/*" element={<FacilityItem4 />} />
            <Route path="item5/*" element={<FacilityItem5 />} />
            {/* <Route path="*" element={<FacilityItem1 />} /> */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;