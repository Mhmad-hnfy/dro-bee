import React from "react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { products, addToCart, getDiscountedPrice, t } = useShop();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        {t("search.resultsFor")} "{query}"
      </h2>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">{t("search.noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg shadow hover:shadow-lg transition-shadow bg-white overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success(t("common.addedToCart"));
                  }}
                  className="absolute bottom-0 left-0 w-full bg-yellow-500 text-black py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 font-semibold"
                >
                  {t("common.addToCart")}
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs text-gray-400 uppercase">
                  {product.category}
                </span>
                <h3 className="font-semibold text-lg truncate">
                  {product.name}
                </h3>
                <div className="flex flex-col mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-600 text-lg">
                      EGP {getDiscountedPrice(product).toFixed(2)}
                    </span>
                    {parseFloat(product.discount) > 0 && (
                      <span className="text-xs text-gray-400 line-through font-bold">
                        EGP{" "}
                        {parseFloat(
                          product.price.toString().replace(/[^\d.]/g, ""),
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {parseFloat(product.discount) > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded w-fit font-black mt-1">
                      {product.discount}% {t("common.off")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
