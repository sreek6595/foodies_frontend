import React from 'react';
import Navbar from '../components/Navbar';
import Herosection from '../components/Herosection';
import About from '../components/About';
import Statssection from '../components/Statssection';
import WhyUs from '../components/WhyUs';
import Menu from '../components/Menu';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

 

function Customerpage() {
  return (
    <>
      <Navbar />
      <Herosection />
      <About />
      <WhyUs />
      <Statssection />
      <Menu />
      <Contact />
      <Footer />
    </>
  );
}

export default Customerpage;
