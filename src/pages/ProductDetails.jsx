import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";
import Loading from "../assets/Components/Loading";

function ProductDetails() {
  const { id } = useParams();
  const { products, addToCart, trackProductView, getDiscountedPrice, t } =
    useShop();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null); // Added missing state for product
  const [activeImage, setActiveImage] = useState(null);
  const [isSearching, setIsSearching] = useState(true);

  // 1. Initial Load / ID change effect
  useEffect(() => {
    setIsSearching(true);
    setQuantity(1);
    setActiveImage(null); // Clear previous product's image
    const timer = setTimeout(() => setIsSearching(false), 400);
    return () => clearTimeout(timer);
  }, [id]);

  // 2. Finding product logic (reactive to context updates)
  useEffect(() => {
    let found = products.find((p) => p?.id?.toString() === id);

    if (!found && id === "dummy1") {
      found = {
        id: "dummy1",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
        name: "Classic T-Shirt",
        description: "High quality cotton",
        price: "29.99",
        category: "Men",
        stock: 10,
      };
    }

    if (found) {
      setProduct(found);
      if (!activeImage || !found.images?.includes(activeImage)) {
        setActiveImage(found.image);
      }
    }
  }, [id, products]);

  // 3. Tracking logic (only once per ID mount/change)
  useEffect(() => {
    if (id) {
      trackProductView(id);
    }
  }, [id]);

  if (isSearching) {
    return <Loading fullScreen message={t("common.fetching")} />;
  }

  if (!product) {
    return (
      <div className="p-10 text-center">{t("common.productNotFound")}</div>
    );
  }

  const stock =
    product.stock !== undefined ? parseInt(product.stock) : Infinity;
  const isOutOfStock = stock <= 0;

  const increment = () =>
    setQuantity((prev) => {
      if (prev >= stock) {
        toast.error(
          `${t("common.onlyItems")} ${stock} ${t("common.availableItems")}`,
        );
        return prev;
      }
      return prev + 1;
    });
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10 bg-white p-8 rounded shadow-sm">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <img
            src={activeImage || product.image}
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg bg-gray-50 border"
          />
          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {[product.image, ...product.images]
                .filter(
                  (img, index, self) => img && self.indexOf(img) === index,
                )
                .map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${activeImage === img ? "border-black" : "border-transparent hover:border-gray-300"}`}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-yellow-600">
              EGP {getDiscountedPrice(product).toFixed(2)}
            </span>
            {parseFloat(product.discount) > 0 && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through font-bold">
                  EGP{" "}
                  {parseFloat(
                    product.price.toString().replace(/[^\d.]/g, ""),
                  ).toFixed(2)}
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                  {product.discount}% {t("common.off")}
                </span>
              </div>
            )}
          </div>

          {/* Stock Display */}
          <div className="text-sm font-medium">
            {t("common.status")}:{" "}
            {isOutOfStock ? (
              <span className="text-red-600">{t("common.outOfStock")}</span>
            ) : (
              <span className="text-green-600">
                {t("common.inStock")} (
                {stock === Infinity ? t("common.unlimited") : stock}{" "}
                {t("common.available")})
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-700 font-semibold">
                  {t("common.quantity")}:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrement}
                    disabled={quantity <= 1}
                    className="px-4 py-2 hover:bg-gray-100 border-r border-gray-300 text-lg font-medium disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    disabled={quantity >= stock}
                    className="px-4 py-2 hover:bg-gray-100 border-l border-gray-300 text-lg font-medium disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  toast.success(`${t("common.addedToCart")} (${quantity})`);
                }}
                disabled={isOutOfStock}
                className="flex-1 bg-yellow-500 text-black py-4 rounded-full font-bold hover:bg-yellow-400 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? t("common.outOfStock") : t("common.addToCart")}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              {t("common.freeShippingNotice")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
