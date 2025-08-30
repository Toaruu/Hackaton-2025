import React from 'react';
import '../App.css';
import '../styles/HomePage.css'; // Create this CSS file for specific styles
import nextIcon from '../assets/next.png'; // Ensure you have this icon in the specified path

const HomePage = () => {
  return (
    <section className="homepage">
      
        <div className="homepage__image">

        </div>

        <div className="homepage__tagline">
            <h1 className="homepage__title">Scan. Sort.</h1>
            <h1 className="homepage__title">Save the PLANET.</h1>
            
            <p className="homepage__vision">
                Your camera. Our AI. A planet-first solution to waste sorting.
            </p>

            <div className="homepage__buttons">
                <button className="homepage__button">
                    <img src={nextIcon} alt="Next Icon" style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Scan now!
                </button>
            </div>
        </div>
    </section>
  );
};

export default HomePage;
