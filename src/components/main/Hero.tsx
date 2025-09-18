import heroImg from "../../assets/backgroundSushi.svg";
import orange from "../../assets/004-orange-juice.svg";
import brocolli from "../../assets/003-broccoli.svg";
import fish from "../../assets/005-fish.svg";
import bakery from "../../assets/006-dough.svg";
import meat from "../../assets/002-beef.svg";
import pasta from "../../assets/001-pasta.svg";
import sweet from "../../assets/007-cupcake.svg";

function Hero() {
  return (
    <div className="hero-container">
      <div className="hero">
        <div className="left-side">
          <h1 className="hero-text">
            <span className="hero-title-line">All You Need For</span>
            <span className="hero-title-accent">Perfect Breakfast</span>
          </h1>
          <p className="hero-para">
            Start your day with the finest ingredients for a nutritious and delicious breakfast. 
            We provide fresh, high-quality products to make your mornings special.
          </p>
          <div className="hero-buttons">
            <button className="cta-button primary">
              Buy Now
              <span className="button-hover-effect"></span>
            </button>
            <button className="cta-button secondary">
              See More
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
        
        <div className="right-side">
          <div className="hero-image-container">
            <img src={heroImg} alt="Delicious breakfast items" className="hero-main-image" />
            <div className="floating-element floating-element-1"></div>
            <div className="floating-element floating-element-2"></div>
            <div className="floating-element floating-element-3"></div>
          </div>
        </div>
      </div>
      
      <div className="hero-bottom">
        <div className="categories-container">
          <div className="category-item">
            <div className="category-icon">
              <img src={orange} alt="Fruits" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Fruits</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={brocolli} alt="Vegetables" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Vegetables</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={fish} alt="Semi-Finished" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Semi-Finished</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={bakery} alt="Bakery" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Bakery</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={meat} alt="Meat" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Meat</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={pasta} alt="Pasta" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Pasta</p>
          </div>
          
          <div className="category-item">
            <div className="category-icon">
              <img src={sweet} alt="Sweets" />
              <div className="icon-hover-effect"></div>
            </div>
            <p className="category-name">Sweets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;