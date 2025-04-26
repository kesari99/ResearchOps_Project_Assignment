import { Route, Routes } from "react-router-dom";
import Listings from "./pages/dashboard";
import AuthPage from "./pages/auth";
import RouteGaurd from "./route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import AssignProjectPage from "./pages/admin/assign-project";
import ProjectDetails from "./pages/user/ProjectDetails";
import DailyMeetingTrigger from "./components/meeting/DailyMeetingTrigger";

export default function App() {
  const {auth} = useContext(AuthContext)
  console.log(auth)
  return (
    <>
      <Routes>
        <Route path="/" element={<RouteGaurd authenticate={auth.authenticate} element={<Listings />} />} />
        <Route path="/auth" element={<RouteGaurd authenticate={auth.authenticate} element={<AuthPage />} />} />
        <Route path="/project/add-project/:userId" element={<RouteGaurd authenticate={auth.authenticate} element={<AssignProjectPage />} />} />
        <Route 
          path="/projects/:projectId" 
          element={<RouteGaurd authenticate={auth.authenticate} element={<ProjectDetails />} />} 
        />
      </Routes>
      <DailyMeetingTrigger />
    </>
  )
}