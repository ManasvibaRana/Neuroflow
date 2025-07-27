import "./app.css";
import Landing from "./LandingPage/Landing";
import ChatPage from "./Chat/Chatpage";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Productivity from "./Productivity/Productivity";
import J1 from "./Journal/JournalForm";
import Pomodo from "./Pomodo/Pomodo";
import UserDashboard from "./Dashboard/UserDashboard";
import Activity from "./Activity/ActivityPage";
import PendingTasks from "./Productivity/PendingTasks";
import AnalysisPage from "./Analysis/AnalysisPage"
import { Toaster } from 'sonner';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from "react-router-dom";

import { isLoggedIn } from "./Login/CheckLogin";

const PrivateRoute = () => {
  const location = useLocation();
  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export function App() {
  return (
    <BrowserRouter>
      <div className="floating-background">
        <div className="dots"></div>
        <div className="dots"></div>
        <div className="dots"></div>
        <div className="dots"></div>
        <div className="dots"></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/journal" element={<J1 />} />

          <Route element={<PrivateRoute />}>
            <Route path="/pomodo" element={<Pomodo />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/analysis" element={<AnalysisPage/>} />
            <Route path="/pending-tasks" element={<PendingTasks />} />
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
