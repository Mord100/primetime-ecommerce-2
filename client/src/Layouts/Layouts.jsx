import Hero from "../components/Hero";
import PromoSlider from "../components/Slider";
import Footer from "./Footer"
import Navbar from "./Navbar"


const Layout = ({children}) =>{
    return (
        <>
        <Navbar/>
        {/* <PromoSlider/> */}
        {/* <Hero/> */}
        <main className="font-inter">{children}</main>
        <Footer/>
        </>
    )
}

export default Layout;