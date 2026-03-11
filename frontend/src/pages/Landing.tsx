import Layout from "../components/Layout";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div>
      <Layout>
        <Hero />
        <Categories />
        <FeaturedProducts />
      </Layout>
      <Footer />
    </div>
  );
}
