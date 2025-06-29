import "./app.css";
import Landing from './LandingPage/Landing'
import ChatPage from './Chat/Chatpage';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Productivity from './Productivity/Productivity'
import J1 from './Journal/JournalForm';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Pomodo from "./Pomodo/Pomodo";
import { useLocation } from "react-router-dom";


const PrivateRoute = ({ children }) => {
  const location = useLocation();
  return isLoggedIn() ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export function App() {
  return (
    <>

    <BrowserRouter>
     <Routes>

      <Route path="/" element={<Landing/>}/>
      <Route path='/chat' element={<ChatPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/journal" element={<J1 />} />
      <Route path="/pomodo" element={<Pomodo/>}/>
      <Route path="/productivity" element={<Productivity/>}/>
      </Routes> 
     </BrowserRouter>

    </>
  );
}