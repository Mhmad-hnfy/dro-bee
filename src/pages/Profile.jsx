import React from "react";
import { useShop } from "../context/ShopContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

function Profile() {
  const { currentUser, orders, logout, t } = useShop();
  const navigate = useNavigate();

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

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
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
