import Layout from "../Layouts/Layouts"
import Hero from "../components/Hero";
import Logos from "../components/Logos";
import Products from "../components/Products"

const Home =  () => {
    return (
      <Layout>
        <Hero/>
        {/* <Logos/> */}
        <Products></Products>
      </Layout>
    );
}

export default Home;