import FreeService from "../../components/freeService/FreeService"
import FreshProduct from "../../components/freshProduct/FreshProduct"
import Hero from "../../components/main/Hero"
import MobileApp from "../../components/mobileApp/MobileApp"
import Products from "../../components/product/Products"
import SellingProducts from "../../components/sellingProducts/SellingProducts"
import BestSelling from './../../components/bestSelling/BestSelling';
import Snowfall from 'react-snowfall'

function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-[1500px] mx-auto">
        <Products />
        <FreeService />
        <SellingProducts />
        <FreshProduct />
        <BestSelling />
        <MobileApp />

        <div className="absolute inset-0 pointer-events-none z-10">
          <Snowfall
  color="#f64266"
  snowflakeCount={70}
  speed={[0.50, 0.75]}
  wind={[-0.12, 0.12]}
  radius={[0.5, 2.6]}
/>

        </div>
      </div>
      </>
  )
}

export default Home


{/* <div className="not-floating-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="not-particle" style={{
              animationDelay: `${i * 0.5}s`,
              left: `${Math.random() * 100}%`
            }}></div>
          ))}
        </div> */}