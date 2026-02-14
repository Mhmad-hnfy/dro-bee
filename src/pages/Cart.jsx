import React from "react";
import { useShop } from "../context/ShopContext";
import { Link } from "react-router-dom";

function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    settings,
    getDiscountedPrice,
    t,
  } = useShop();

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = getDiscountedPrice(item);
      return total + price * item.qty;
    }, 0);
  };

  const subtotal = calculateTotal();
  const total = subtotal + parseFloat(settings.shippingCost);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t("cart.empty")}</h2>
        <Link to="/" className="text-yellow-600 hover:underline">
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">{t("cart.title")}</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded shadow">
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-yellow-600 font-bold text-sm">
                      EGP {getDiscountedPrice(item).toFixed(2)}
                    </p>
                    {parseFloat(item.discount) > 0 && (
                      <p className="text-gray-400 text-xs line-through">
                        EGP{" "}
                        {parseFloat(
                          item.price.toString().replace(/[^\d.]/g, ""),
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-2 font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    disabled={
                      item.stock !== undefined &&
                      item.qty >= parseInt(item.stock)
                    }
                    className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm ml-2"
                >
                  {t("cart.remove")}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="mt-4 text-red-600 text-sm hover:underline"
          >
            {t("cart.clear")}
          </button>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 rounded shadow h-fit">
          <h3 className="text-xl font-bold mb-4">{t("cart.summary")}</h3>
          <div className="flex justify-between mb-2">
            <span>{t("cart.total")}</span>
            <span>EGP {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>{t("cart.shipping")}</span>
            <span>EGP {settings.shippingCost}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between mb-6 font-bold text-lg">
            <span>{t("cart.finalTotal")}</span>
            <span>EGP {total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full bg-yellow-500 text-black font-bold text-center py-3 rounded hover:bg-yellow-400 transition"
          >
            {t("cart.checkout")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
