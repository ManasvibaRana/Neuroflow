import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./LandingPage/Navbar";
import HeroSection from "./LandingPage/HeroSection";
import Journal from "./LandingPage/Journal";
import Review from "./LandingPage/Review";
import Footer from "./LandingPage/Footer";
import Login from "./LandingPage/Login";
import SignIn from "./LandingPage/SignIn";

function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      {showLogin ? (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      ) : showSignup ? (
        <SignIn
          onBackToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      ) : (
        <>
          <HeroSection />
          <Journal />
          <Review />
          <Footer />
        </>
      )}
    </>
  );
}

export default Landing;
