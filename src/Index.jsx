
import React from 'react';
import "tailwindcss/tailwind.css"
import Navbar from './components/Navbar';
import Herosection from './components/Herosection';
import About from './components/About';
import Menu from './components/Menu';
import Menu from './components/Event';
import Contact from './components/Contact';
import Footer from './components/Footer';

import Footer from './pages/Signup';
import Footer from './pages/Login';





const App=()=> {
  return (
    <div>
        <Navbar/>
        <Herosection/>
        <Header/>
        <About/>
        <WhyUs/>
        <Statssection/>
        <Menu/>
        <Contact/>
        <Footer/>
        <Signup/>
        <Login/>

        


        
    </div>
  );
};

export default App;