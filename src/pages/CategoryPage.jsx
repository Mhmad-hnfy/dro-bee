import React from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../assets/Components/ProductCard";
import Nav from "../assets/Components/Nav";
import Footer from "../assets/Components/Footer";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { products, t } = useShop();

  // Filter products by category
  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === categoryName.toLowerCase(),
  );

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white pt-12">
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="mb-12" data-aos="fade-down">
            <h1 className="text-5xl font-black text-black uppercase tracking-tighter">
              {categoryName}{" "}
              <span className="text-yellow-500">{t("home.collection")}</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {t("common.showingItems")} {categoryName}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-400 font-bold">
                {t("common.noProducts")}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
