import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useShop } from "../../context/ShopContext";
import { ShoppingCart, Zap } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart, getDiscountedPrice, t } = useShop();
  const navigate = useNavigate();

  const discountedPrice = getDiscountedPrice(product);
  const originalPrice =
    typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^\d.]/g, ""))
      : parseFloat(product.price);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate("/checkout");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(t("common.addedToCart"));
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col w-64 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md shadow-red-500/30 flex items-center gap-1">
          <Zap size={12} className="fill-current" />
          <span>
            -{product.discount}% {t("common.off")}
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 rounded-t-2xl">
        <img
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        {/* Hover Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-2 z-20">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black font-bold py-2.5 px-4 text-sm rounded-xl hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <ShoppingCart size={16} />
            {t("common.addToCart") || "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full bg-yellow-500 text-black font-black py-2.5 px-4 text-sm rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30 active:scale-95 uppercase tracking-wider"
          >
            <Zap size={16} className="fill-current" />
            {t("common.buyNow") || "Buy Now"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1 truncate">
          {product.category || "Product"}
        </p>
        <h3 className="text-lg font-black text-gray-900 group-hover:text-yellow-600 transition-colors leading-tight line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              Price
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-black text-gray-900">
                EGP {discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-400 line-through font-bold">
                  {originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
