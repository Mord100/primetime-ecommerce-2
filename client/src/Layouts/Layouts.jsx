import Hero from "../components/Hero";
import Footer from "./Footer"
import Navbar from "./Navbar"


const Layout = ({children}) =>{
    return (
        <>
        <Navbar/>
        {/* <Hero/> */}
        <main className="font-inter">{children}</main>
        <Footer/>
        </>
    )
}

export default Layout;