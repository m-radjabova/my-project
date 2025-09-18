import FreeService from "../../components/freeService/FreeService"
import FreshProduct from "../../components/freshProduct/FreshProduct"
import Hero from "../../components/main/Hero"
import MobileApp from "../../components/mobileApp/MobileApp"

function Home() {
  return (
    <div className="max-w-[1400px] mx-auto px-4">
      <Hero />
      <FreeService />
      <FreshProduct />
      <MobileApp />
    </div>
  )
}

export default Home