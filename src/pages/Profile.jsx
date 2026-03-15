import React from "react";
import { useShop } from "../context/ShopContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

function Profile() {
  const { currentUser, orders, logout, paymentMethods, addPaymentMethod, removePaymentMethod, t } = useShop();
  const navigate = useNavigate();

  const [isAddingMethod, setIsAddingMethod] = React.useState(false);
  const [newMethod, setNewMethod] = React.useState({ type: "wallet", provider: "vodafone", identifier: "" });

  // Redirect if not logged in
  React.useEffect(() => {
    // Small delay or check to ensure state has time to sync
    const timer = setTimeout(() => {
      if (!currentUser) navigate("/login");
    }, 100);
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myOrders = orders
    .filter((o) => o.user?.id === currentUser.id)
    .slice()
    .reverse();

  const handleLogout = () => {
    logout();
    toast.success(t("nav.logout") + " " + t("nav.hi")); // Or a specific success message
    navigate("/");
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!newMethod.identifier) {
      toast.error(t("profile.enterIdentifier") || "Please enter number/identifier");
      return;
    }
    await addPaymentMethod(newMethod);
    setIsAddingMethod(false);
    setNewMethod({ type: "wallet", provider: "vodafone", identifier: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm mb-8">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-400 rounded-full flex items-center justify-center text-black text-3xl md:text-5xl font-black shadow-xl shadow-yellow-200 ring-4 ring-white transition-transform group-hover:scale-105">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                {currentUser.name}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {currentUser.phone || t("profile.noPhone")}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-full transition-all duration-300 text-sm border border-transparent hover:border-red-100"
            >
              {t("profile.logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-12">
        <div className="max-w-4xl mx-auto">
          {/* Wallet Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <span className="w-2 h-8 bg-black rounded-full"></span>
                {t("profile.walletAndPayments") || "Wallet & Payment Methods"}
              </h3>
              <button
                onClick={() => setIsAddingMethod(!isAddingMethod)}
                className="px-4 py-2 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all shadow-md shadow-yellow-200"
              >
                {isAddingMethod ? t("common.cancel") || "Cancel" : t("profile.addNew") || "+ Add New"}
              </button>
            </div>

            {isAddingMethod && (
              <form onSubmit={handleAddMethod} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6 animate-in fade-in slide-in-from-top-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Type</label>
                    <select
                      className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 font-bold text-sm"
                      value={newMethod.type}
                      onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value, provider: e.target.value === "wallet" ? "vodafone" : "visa" })}
                    >
                      <option value="wallet">Digital Wallet</option>
                      <option value="card">Bank Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Provider</label>
                    {newMethod.type === "wallet" ? (
                      <select
                        className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 font-bold text-sm"
                        value={newMethod.provider}
                        onChange={(e) => setNewMethod({ ...newMethod, provider: e.target.value })}
                      >
                        <option value="vodafone">Vodafone Cash</option>
                        <option value="orange">Orange Cash</option>
                        <option value="etisalat">Etisalat Cash</option>
                        <option value="instapay">InstaPay</option>
                      </select>
                    ) : (
                      <select
                        className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 font-bold text-sm"
                        value={newMethod.provider}
                        onChange={(e) => setNewMethod({ ...newMethod, provider: e.target.value })}
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Number / Last 4 Digits</label>
                    <input
                      type="text"
                      className="w-full bg-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 font-bold text-sm"
                      placeholder={newMethod.type === "wallet" ? "01xxxxxxxxx" : "xxxx"}
                      value={newMethod.identifier}
                      onChange={(e) => setNewMethod({ ...newMethod, identifier: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors">
                  {t("profile.saveMethod") || "Save Payment Method"}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${method.type === 'wallet' ? 'bg-black text-white' : 'bg-yellow-400 text-black'}`}>
                        {method.type === 'wallet' ? '📱' : '💳'}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest">{method.provider}</h4>
                        <p className="text-xs font-bold text-gray-400">{method.identifier}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removePaymentMethod(method.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t("profile.noPaymentMethods") || "No payment methods saved."}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
              {t("profile.history")}
            </h3>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600 uppercase tracking-widest">
              {myOrders.length} {t("profile.placedOrders")}
            </span>
          </div>

          <div className="grid gap-6">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group overflow-hidden relative"
              >
                {/* Status Bar */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${
                    order.status === "Pending"
                      ? "bg-yellow-400"
                      : order.status === "Shipped"
                        ? "bg-blue-400"
                        : "bg-green-400"
                  }`}
                ></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-xl text-gray-900 font-poppins">
                        {t("profile.orderId")} #{order.id}
                      </h4>
                      <Link
                        to="/receipt"
                        state={{ order }}
                        className="text-yellow-600 p-1 hover:bg-yellow-50 rounded transition-colors"
                        title="View Receipt"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      {t("profile.date")}:{" "}
                      {new Date(order.date).toLocaleDateString()}
                      {new Date(order.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      EGP{" "}
                      {typeof order.total === "number"
                        ? order.total.toFixed(2)
                        : order.total}
                    </span>
                    <span
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {t(`checkout.${order.status.toLowerCase()}`)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    {t("profile.itemsOrdered")}
                  </div>
                  <div className="grid gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center font-bold text-yellow-600 text-xs">
                            {item.qty}x
                          </div>
                          <div>
                            <p className="font-bold text-gray-700">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-500">
                          EGP {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {myOrders.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2">
                  {t("profile.noActiveOrders")}
                </h4>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                  {t("profile.startExploring")}
                </p>
                <Link
                  to="/products"
                  className="inline-block px-10 py-4 bg-yellow-400 text-black font-black rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-xl shadow-yellow-200"
                >
                  {t("profile.goShopping")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
