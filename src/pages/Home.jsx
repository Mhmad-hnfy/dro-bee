import React from "react";
import Hero from "../assets/Components/Hero";
import Sections from "../assets/Components/Sections";
import Product from "../assets/Components/Product";
import Footer from "../assets/Components/Footer";
import Nav from "../assets/Components/Nav";
import { useShop } from "../context/ShopContext";

function Home() {
  const { categories, t } = useShop();

  return (
    <>
      <Nav />
      <Hero />

      <Sections />
      {categories.map((category, index) => (
        <Product
          key={index}
          category={category}
          title={`${category} ${t(" - DRO BEE")}`}
          subtitle={`${t("home.explore")} ${category}`}
        />
      ))}
      <Footer />
    </>
  );
}

export default Home;
