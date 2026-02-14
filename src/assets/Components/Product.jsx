import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";
import ProductCard from "./ProductCard";

export default function Product({
  category = "Men",
  title = "Product",
  subtitle = "Men's clothing",
}) {
  const { products, addToCart, t } = useShop();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Filter products by category
  const filteredProducts = products.filter((p) => p.category === category);

  // Combine with dummy if empty (optional, but good for demo)
  const displayProducts =
    filteredProducts.length > 0
      ? filteredProducts
      : [
          // Keep dummy data if no products added yet to avoid empty sections
          // {
          //   id: 'dummy1',
          //   image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
          //   name: "Classic T-Shirt",
          //   description: "High quality cotton",
          //   price: "29.99"
          // }
        ];

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                .font-poppins { font-family: 'Poppins', sans-serif; }
            `}</style>

      <div data-aos="fade-up" className="max-w-6xl mx-auto pt-20 pb-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 font-poppins uppercase tracking-tighter">
              {title}
            </h2>
            <p className="text-sm font-bold text-yellow-600 font-poppins uppercase tracking-[0.3em]">
              {subtitle}
            </p>
          </div>
          <Link
            to={`/category/${category}`}
            className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg shadow-black/5"
          >
            {t("common.viewAll")}
          </Link>
        </div>

        <section className="flex flex-wrap gap-6 justify-center">
          {filteredProducts.slice(0, 4).map((product, i) => (
            <ProductCard key={i} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-gray-500">{t("common.noProducts")}</p>
          )}
        </section>
      </div>
    </>
  );
}
