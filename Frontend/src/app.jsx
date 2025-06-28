
import "./app.css";
import Landing from './LandingPage/Landing'
import ChatPage from './Chat/Chatpage';
import Login from './Login/Login';
import Signup from './Login/Signup';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

export function App() {
  return (
    <>

    <BrowserRouter>
     <Routes>

      <Route path="/" element={<Landing/>}/>
      <Route path='/chat' element={<ChatPage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/signup" element={<Signup />} />
      </Routes> 
     </BrowserRouter>

    </>
  );
}
