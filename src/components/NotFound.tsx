import { FaHome, FaUtensils, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { GiBacon } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { FiCoffee } from 'react-icons/fi';

function NotFound() {
  const navigate = useNavigate()
  
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="animation-container">
          <div className="floating-icon icon-1">
            <GiBacon />
          </div>
          <div className="floating-icon icon-2">
            <FiCoffee />
          </div>
          <div className="floating-icon icon-3">
            <FaUtensils />
          </div>
        </div>
        
        <div className="not-found-text">
          <h1>4<span className="highlight">0</span>4</h1>
          <h2>Ops, Page Not Found !!!</h2>
          <p>Unfortunately, the page you are looking for does not exist. <br /> It may have been removed or the URL has changed.</p>
        </div>
        
        <div className="action-buttons">
          <button className="btn primary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <button className="btn secondary" onClick={() => navigate('/')}>
            <FaHome /> Home Page
          </button>
          <button className="btn outline" onClick={() => {
            const query = prompt("What breakfast are you looking for?");
            if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
          }}>
            <FaSearch /> Search Breakfast
          </button>
        </div>
        
        <div className="breakfast-tips">
          <h3>Breakfast Tips</h3>
          <div className="tips-container">
            <div className="tip">
              <div className="tip-icon">🥓</div>
              <p>To make bacon crispier, toss it in a little flour before cooking</p>
            </div>
            <div className="tip">
              <div className="tip-icon">🍳</div>
              <p>For perfect scrambled eggs, always cook them over medium heat</p>
            </div>
            <div className="tip">
              <div className="tip-icon">🥐</div>
              <p>To reheat croissants to their original flakiness, bake them at 180°C for 5 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound;