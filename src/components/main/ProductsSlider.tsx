import Slider from "react-slick";
import useProducts from "../../hooks/useProducts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { API_ORIGIN } from "../../utils";
import type { Product } from "../../types/types";

function ProductsSlider() {
  const { products } = useProducts();
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,  
    cssEase: "ease-in-out",
    swipe: true,
    draggable: true,
    fade: false,
    waitForAnimate: false, 
    adaptiveHeight: false,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="products-slider-container max-w-[1800px] mx-auto ">
      <Slider {...settings}>
        {products.map((product :Product) => (
          <div key={product.id} className="product-slide">
            <div className="product-slider-card">
              <LazyLoadImage
                effect="blur"
                loading="lazy"
                src={`${API_ORIGIN}${product.image}`}
                alt={product.name}
                className="product-slider-image"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductsSlider;
