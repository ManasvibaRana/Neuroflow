import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Journal from "./Journal";
import Review from "./Review"; 
import Footer from "./Footer";


function Landing() {
 
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);



  return (
    <>
          <Navbar />
     
          <HeroSection />
          <Journal />
          <Review />
          <Footer />
        </>
  );
  

}

export default Landing;
