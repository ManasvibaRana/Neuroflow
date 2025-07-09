import "./app.css";
import Landing from "./LandingPage/Landing";
import ChatPage from "./Chat/Chatpage";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Productivity from "./Productivity/Productivity";
import J1 from "./Journal/JournalForm";
import Pomodo from "./Pomodo/Pomodo";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import ActivityPage from "./Activity/ActivityPage";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
=======
import UserDashboard from "./Dashboard/UserDashboard";
import ChatButton from "./Chat/ChatButton";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
>>>>>>> Stashed changes

=======
import UserDashboard from "./Dashboard/UserDashboard";
import ChatButton from "./Chat/ChatButton";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

>>>>>>> Stashed changes
import { isLoggedIn } from "./Login/CheckLogin"; // ✅ Import here

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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/journal" element={<J1 />} />
        <Route path="/activity" element={<ActivityPage/>}/>

        {/* ✅ Protected routes go inside this parent */}
        <Route element={<PrivateRoute />}>
          <Route path="/pomodo" element={<Pomodo />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/productivity" element={<Productivity />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
