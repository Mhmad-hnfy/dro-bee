import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Checkout() {
  const { cart, settings, createOrder, getDiscountedPrice, promoCodes } =
    useShop();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone1: "",
    phone2: "",
    address: "",
    paymentMethod: "cod", // Default to Cash on Delivery
    walletType: "", // Added for Egyptian Wallets
    walletNumber: "", // Added for Egyptian Wallets
    cardDetails: {
      number: "",
      expiry: "",
      cvc: "",
      holderName: "",
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = getDiscountedPrice(item);
      return total + price * item.qty;
    }, 0);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === code);
    if (found) {
      setAppliedPromo(found);
      toast.success(`Promo code applied! ${found.discount}% OFF`);
    } else {
      toast.error("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = appliedPromo
    ? (subtotal * appliedPromo.discount) / 100
    : 0;
  const total = subtotal - discountAmount + parseFloat(settings.shippingCost);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setFormData({
      ...formData,
      cardDetails: {
        ...formData.cardDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.paymentMethod === "card") {
      if (
        !formData.cardDetails.number ||
        !formData.cardDetails.expiry ||
        !formData.cardDetails.cvc ||
        !formData.cardDetails.holderName
      ) {
        toast.error("Please fill in all card details.");
        return;
      }
    }

    if (formData.paymentMethod === "wallet") {
      if (!formData.walletType || !formData.walletNumber) {
        toast.error("Please select a wallet and provide your wallet number.");
        return;
      }
      if (formData.walletNumber.length < 11) {
        toast.error("Please enter a valid wallet number.");
        return;
      }
    }

    setIsProcessing(true); // Guard against immediate redirect
    // Create Order
    const newOrder = await createOrder(formData, appliedPromo);

    toast.success("Order Placed Successfully!");

    // Navigate to Receipt with order details
    navigate("/receipt", { state: { order: newOrder } });
  };

  // Use effect for redirection to avoid race conditions during order placement
  React.useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      navigate("/cart");
    }
  }, [cart, navigate, isProcessing]);

  if (cart.length === 0 && !isProcessing) return null;

  return (
    <div className="container mx-auto p-6 min-h-screen flex justify-center bg-gray-50/50">
      <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic mb-1">
            Dro<span className="text-yellow-500">Bee</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Checkout & Secure Payment
          </p>
        </div>

        <div className="mb-8 bg-yellow-400 p-6 rounded-2xl shadow-lg shadow-yellow-200">
          <p className="flex justify-between items-center text-black">
            <span className="font-bold opacity-70 uppercase text-xs tracking-wider">
              {t("checkout.totalDue")}
            </span>
            <span className="text-2xl font-black italic">
              EGP {total.toFixed(2)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {t("checkout.fullName")}
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-gray-300 font-medium"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {t("checkout.phone1")}
              </label>
              <input
                type="tel"
                name="phone1"
                required
                placeholder="01xxxxxxxxx"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-gray-300 font-medium"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                {t("checkout.phone2")}
              </label>
              <input
                type="tel"
                name="phone2"
                placeholder="01xxxxxxxxx"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-gray-300 font-medium"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              {t("checkout.address")}
            </label>
            <textarea
              name="address"
              required
              placeholder="Enter your detailed address"
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-gray-300 font-medium h-24 resize-none"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              {t("checkout.promoCode")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t("checkout.enterCode")}
                className="flex-1 bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 transition-all font-mono tracking-widest uppercase text-sm"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-black text-white px-6 rounded-xl font-black text-xs uppercase hover:bg-gray-800 transition-colors"
              >
                {t("checkout.apply")}
              </button>
            </div>
            {appliedPromo && (
              <p className="mt-2 text-[10px] font-black text-green-600 uppercase italic">
                ✓ {t("checkout.code")} "{appliedPromo.code}"{" "}
                {t("checkout.applied")}! {t("checkout.saved")} EGP{" "}
                {discountAmount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">
              {t("checkout.paymentMethod")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cod", label: t("checkout.cod"), icon: "🚚" },
                { id: "card", label: t("checkout.card"), icon: "💳" },
                { id: "wallet", label: t("checkout.wallet"), icon: "📱" },
                { id: "paypal", label: "PayPal", icon: "🅿️" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                    formData.paymentMethod === method.id
                      ? "border-yellow-400 bg-yellow-50 ring-4 ring-yellow-400/10"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="text-2xl mb-2">{method.icon}</span>
                  <span
                    className={`text-[10px] font-black uppercase text-center ${formData.paymentMethod === method.id ? "text-yellow-600" : "text-gray-500"}`}
                  >
                    {method.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Conditional Forms */}
          {formData.paymentMethod === "card" && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-lg">
                  💳
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-700">
                  Card Details
                </h4>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  name="holderName"
                  placeholder="Cardholder Name"
                  className="w-full bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold transition-all"
                  onChange={handleCardChange}
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Card Number"
                  maxLength="19"
                  className="w-full bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold tracking-widest transition-all"
                  onChange={handleCardChange}
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    className="w-1/2 bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold transition-all text-center"
                    onChange={handleCardChange}
                  />
                  <input
                    type="password"
                    name="cvc"
                    placeholder="CVC"
                    maxLength="4"
                    className="w-1/2 bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold transition-all text-center"
                    onChange={handleCardChange}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === "wallet" && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-lg">
                  📱
                </div>
                <h4 className="font-black text-xs uppercase tracking-widest text-gray-700">
                  Digital Wallet
                </h4>
              </div>
              <div className="space-y-4">
                <select
                  name="walletType"
                  className="w-full bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold transition-all"
                  onChange={handleChange}
                >
                  <option value="">Select Wallet Type</option>
                  <option value="vodafone">Vodafone Cash</option>
                  <option value="orange">Orange Cash</option>
                  <option value="etisalat">Etisalat Cash</option>
                  <option value="instapay">InstaPay / WE</option>
                </select>
                <input
                  type="tel"
                  name="walletNumber"
                  placeholder="Wallet Number (01xxxxxxxxx)"
                  className="w-full bg-white border-2 border-transparent focus:border-yellow-400 rounded-xl px-4 py-3 text-sm font-bold transition-all"
                  onChange={handleChange}
                />
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed text-center italic">
                  * Send the amount to our official number after placing the
                  order for confirmation
                </p>
              </div>
            </div>
          )}

          {formData.paymentMethod === "paypal" && (
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg shadow-blue-200">
                  🅿️
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-900 mb-1">
                    PayPal Checkout
                  </h4>
                  <p className="text-[10px] text-blue-500 font-bold uppercase italic">
                    Fast and secure global payment
                  </p>
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full bg-[#0070ba] text-white py-3 rounded-full font-black text-sm uppercase opacity-50 cursor-not-allowed italic"
                >
                  Pay with PayPal
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-200 mt-8"
          >
            {formData.paymentMethod === "cod"
              ? t("checkout.finalize")
              : t("checkout.confirm")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
