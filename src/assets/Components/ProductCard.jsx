import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";

export default function ProductCard({ product }) {
  const { addToCart, getDiscountedPrice, t } = useShop();

  const discountedPrice = getDiscountedPrice(product);
  const originalPrice =
    typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^\d.]/g, ""))
      : parseFloat(product.price);

  return (
    <div className="group w-56 relative">
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter shadow-lg">
          -{product.discount}% {t("common.off")}
        </span>
      )}
      <div className="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-yellow-500/10">
        <Link to={`/product/${product.id}`}>
          <img
            className="w-full h-80 object-cover object-top group-hover:scale-110 duration-500 transition-transform"
            src={product.image}
            alt={product.name}
          />
        </Link>
        <div className="absolute bottom-0 left-0 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 bg-white/95 backdrop-blur-sm p-3">
          <button
            onClick={() => {
              addToCart(product);
              toast.success(t("common.addedToCart"));
            }}
            className="w-full bg-yellow-500 text-black font-semibold py-1.5 text-sm rounded hover:bg-yellow-400 transition-colors"
          >
            {t("common.addToCart")}
          </button>
        </div>
      </div>

      <p className="text-base mt-3 font-bold text-gray-900 group-hover:text-yellow-600 transition-colors truncate">
        {product.name}
      </p>
      <p className="text-xs text-gray-400 truncate mt-1 leading-relaxed">
        {product.description}
      </p>
      <div className="flex flex-col mt-2">
        <div className="flex items-center gap-2">
          <p className="text-xl font-black text-black">
            EGP {discountedPrice.toFixed(2)}
          </p>
          {product.discount > 0 && (
            <p className="text-xs text-gray-400 line-through font-bold">
              EGP {originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
