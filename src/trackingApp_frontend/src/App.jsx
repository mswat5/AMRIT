import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Amrit from "./Pages/landingpage/amrit";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import FirstPageContent from "./Pages/Signup";
import RegisterAmbulance from "./Pages/regAmbulance";
import RegisterFacility from "./Pages/regFacility";
import NotFound from "./NotFound";
import AppRoute from "./layout/Admin/AppRoute";
import AppRoute2 from "./layout/Ambulance/AppRoute";
import AppRoute3 from "./layout/Facility/AppRoute";
import SharedLayout from "./layout/SharedLayout";
import PatientManagement from "./layout/Facility/facilityitems/PatientManagement";
import AccidentManagement from "./layout/Facility/facilityitems/AccidentManagement";
import ResourceManagement from "./layout/Facility/facilityitems/ResourceManagement";
import FacilityDetails from "./layout/Facility/facilityitems/FacilityDetails";
import Reports from "./layout/Facility/facilityitems/Reports";
import UserManagement from "./layout/Admin/UserManagement";
import FacilityApproval from "./layout/Admin/FacilityApproval";
import AmbulanceApproval from "./layout/Admin/AmbulanceApproval";
import InchargeApproval from "./layout/Admin/InchargeApproval";
import Inchargeform from "./Pages/inchargeform";
import PatientManagementTable from "./layout/incharge/PatientManagement";
import InchargeAccidentManagement from "./layout/incharge/AccidentManagement";
import ReportsTable from "./layout/incharge/Reports";

import { createActor as createAdminActor } from "../../declarations/adminCanister";
import { createActor as createAccidentActor } from "../../declarations/accidentCanister";
import { createActor as createFacilityActor } from "../../declarations/facilityCanister";
import { createActor as createPatientActor } from "../../declarations/patientCanister";
import { createActor as createAmbulanceActor } from "../../declarations/ambulanceCanister";
import { createActor as createReportActor } from "../../declarations/reportCanister";

import ActorContext from "./ActorContext";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { useEffect, useState } from "react";

const App = () => {
  const [actors, setActors] = useState({
    admin: null,
    report: null,
    facility: null,
    ambulance: null,
    accident: null,
    patient: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      await initAuthClient();
    };

    initialize();
  }, [isAuthenticated]);

  async function initAuthClient() {
    const client = await AuthClient.create();
    setAuthClient(client);
    if (await client.isAuthenticated()) {
      initializeActors(client);
    }
  }

  async function initializeActors(client) {
    const identity = client.getIdentity();
    const agent = new HttpAgent({ identity });

    if (process.env.DFX_NETWORK !== "ic") {
      await agent.fetchRootKey().catch(console.error);
    }

    try {
      const adminActor = createAdminActor(
        process.env.CANISTER_ID_ADMIN_CANISTER,
        {
          agent,
        }
      );
      const accidentActor = createAccidentActor(
        process.env.CANISTER_ID_ACCIDENT_CANISTER,
        { agent }
      );
      const facilityActor = createFacilityActor(
        process.env.CANISTER_ID_FACILITY_CANISTER,
        { agent }
      );
      const patientActor = createPatientActor(
        process.env.CANISTER_ID_PATIENT_CANISTER,
        { agent }
      );
      const ambulanceActor = createAmbulanceActor(
        process.env.CANISTER_ID_AMBULANCE_CANISTER,
        { agent }
      );
      const reportActor = createReportActor(
        process.env.CANISTER_ID_REPORT_CANISTER,
        {
          agent,
        }
      );

      setActors({
        admin: adminActor,
        report: reportActor,
        facility: facilityActor,
        ambulance: ambulanceActor,
        accident: accidentActor,
        patient: patientActor,
      });
    } catch (error) {
      console.error("Error initializing actors:", error);
    }
  }

  async function login() {
    setActors({
      admin: null,
      report: null,
      facility: null,
      ambulance: null,
      accident: null,
      patient: null,
    });
    if (authClient) {
      await new Promise((resolve) => {
        authClient.login({
          identityProvider: process.env.II_URL,
          onSuccess: resolve,
        });
      });
      setIsAuthenticated(true);
      await initializeActors(authClient);
    }
  }

  return (
    <ActorContext.Provider value={{ actors, isAuthenticated, login }}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Amrit />} />
            <Route path="/register" element={<FirstPageContent />} />
            <Route path="/register">
              <Route path="ambulance" element={<RegisterAmbulance />} />

              <Route path="incharge" element={<Inchargeform />} />

              <Route path="facility" element={<RegisterFacility />} />
            </Route>
            <Route
              path="/admin/*"
              element={
                <SharedLayout>
                  <AppRoute />
                </SharedLayout>
              }
            >
              <Route path="user-management" element={<UserManagement />} />
              <Route path="facility-approval" element={<FacilityApproval />} />
              <Route
                path="ambulance-approval"
                element={<AmbulanceApproval />}
              />
              <Route path="incharge-approval" element={<InchargeApproval />} />
              <Route path="*" element={<Navigate to="facility-approval" />} />
            </Route>

            <Route
              path="/ambulance/*"
              element={
                <SharedLayout>
                  <AppRoute2 />
                </SharedLayout>
              }
            />
            <Route
              path="/incharge/*"
              element={
                <SharedLayout>
                  <AppRoute />
                </SharedLayout>
              }
            >
              <Route
                path="patient-management"
                element={<PatientManagementTable />}
              />
              <Route
                path="accident-management"
                element={<InchargeAccidentManagement />}
              />
              <Route path="reports" element={<ReportsTable />} />
              <Route path="*" element={<Navigate to="patient-management" />} />
            </Route>
            <Route
              path="/facility/*"
              element={
                <SharedLayout>
                  <AppRoute3 />
                </SharedLayout>
              }
            >
              <Route
                path="patient-management/*"
                element={<PatientManagement />}
              />
              <Route
                path="accident-management/*"
                element={<AccidentManagement />}
              />
              <Route
                path="resource-management/*"
                element={<ResourceManagement />}
              />
              <Route path="facility-details/*" element={<FacilityDetails />} />
              <Route path="reports/*" element={<Reports />} />
              {/* <Route path="*" element={<FacilityItem1 />} /> */}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ActorContext.Provider>
  );
};

export default App;
