import "./app.css";
import Landing from "./LandingPage/Landing";
import ChatPage from "./Chat/Chatpage";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Pomodo from "./Pomodo/Pomodo";
import Productivity from "./Productivity/Productivity";
import Journal from "./Journal/Journal";

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Productivity" element={<Productivity />} />
          <Route path="/Journal" element={<Journal />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pomodo" element={<Pomodo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
