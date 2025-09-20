import { FaBacon, FaEgg, FaBreadSlice, FaCoffee } from 'react-icons/fa';
import { GiFrenchFries } from 'react-icons/gi';
import { useEffect, useState } from 'react';

function IsLoading() {
  const [currentIcon, setCurrentIcon] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % 5);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="icon-container">
          <div className={`icon-item ${currentIcon === 0 ? 'active' : ''}`}>
            <FaBreadSlice className="icon" />
          </div>
          <div className={`icon-item ${currentIcon === 1 ? 'active' : ''}`}>
            <FaEgg className="icon" />
          </div>
          <div className={`icon-item ${currentIcon === 2 ? 'active' : ''}`}>
            <FaBacon className="icon" />
          </div>
          <div className={`icon-item ${currentIcon === 3 ? 'active' : ''}`}>
            <GiFrenchFries className="icon" />
          </div>
          <div className={`icon-item ${currentIcon === 4 ? 'active' : ''}`}>
            <FaCoffee className="icon" />
          </div>
        </div>
        
        <h2 className="loading-title">All you need for perfect breakfast</h2>
        
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  )
}

export default IsLoading;