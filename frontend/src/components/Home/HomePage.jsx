import React from 'react';
import '../../app.css'; // Adjust path based on actual file location
import './HomePage.css'; // If HomePage.css is in the same folder
import nextIcon from '../../assets/next.png';
import earthImage from '../../assets/earth.png';
import handImage from '../../assets/hand.png';


const HomePage = () => {
  return (
    <section className="homepage">

        <div className="home__container container grid">
      
            <div className="home__content grid">

                <div className="homepage__image">
                    <img src={earthImage} alt="Earth" className="homepage__earth" />
                    <img src={handImage} alt="Hand" className="homepage__hand" />
                </div>

                <div className="homepage__tagline">
                    <h1 className="homepage__title">Scan. Sort.<br/>
                    <u>Save</u> the PLANET.
                    </h1>                    
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
            </div>
        </div>
    </section>
  );
};

export default HomePage;
