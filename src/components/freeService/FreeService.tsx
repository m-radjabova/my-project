import bgfree from "../../assets/freeService.svg";
import freeDelivery from "../../assets/Free Delivery.svg";
import group from "../../assets/Group 9.svg";

function FreeService() {
  return (
    <div className="free-service">
      <div className="free-service-container">
        <div className="left-side">
          <div className="image-container">
            <img className="bg" src={bgfree} alt="Special offer background" />
            <img 
              className="free-delivery" 
              src={freeDelivery} 
              alt="Free delivery icon" 
            />
            <img 
              className="group" 
              src={group} 
              alt="Quality guarantee icon" 
            />
          </div>
        </div>
        
        <div className="right-side">
          <h1>
            <span className="title-line">Our Special Service</span>
            <span className="title-highlight">Fresh Beef</span>
          </h1>
          
          <div className="pricing">
            <span className="original-price">$20.00</span>
            <span className="discounted-price">$18.00</span>
          </div>
          
          <p className="description">
            Enjoy our premium quality fresh beef with free delivery service and 100% quality guarantee
          </p>
          
          <button className="cta-button">
            Shop Now
            <span className="button-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreeService;