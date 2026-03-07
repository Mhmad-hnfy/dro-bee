import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";
import {
  Users,
  Package,
  ShoppingCart,
  Settings,
  ArrowRight,
  UserCheck,
  PackageCheck,
} from "lucide-react";

function Dashboard() {
  const { users, orders, products, settings, updateShippingCost } = useShop();
  // Safe default just in case settings is undefined initially
  const [shipping, setShipping] = useState(settings?.shippingCost || 0);

  const handleSaveShipping = async () => {
    await updateShippingCost(shipping);
    toast.success("Shipping cost updated successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Admin Dashboard
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
            <Users size={120} />
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 shadow-inner z-10">
            <Users size={28} />
          </div>
          <div className="z-10">
            <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-1">
              Total Users
            </h3>
            <p className="text-4xl font-black text-gray-900">{users.length}</p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12 duration-500">
            <Package size={120} />
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shadow-inner z-10">
            <Package size={28} />
          </div>
          <div className="z-10">
            <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-1">
              Total Products
            </h3>
            <p className="text-4xl font-black text-gray-900">
              {products.length}
            </p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:rotate-12 duration-500">
            <ShoppingCart size={120} />
          </div>
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 shadow-inner z-10">
            <ShoppingCart size={28} />
          </div>
          <div className="z-10">
            <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase mb-1">
              Total Orders
            </h3>
            <p className="text-4xl font-black text-gray-900">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Settings and Recent Orders */}
        <div className="space-y-8 flex flex-col">
          {/* Shipping Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-inner">
                <Settings size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Store Settings
              </h3>
            </div>

            <div className="bg-gray-50/80 p-5 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <label className="text-sm font-bold text-gray-800 block mb-1">
                  Shipping Cost (EGP)
                </label>
                <p className="text-xs text-gray-500 font-medium">
                  This cost will be applied to all new orders.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="number"
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 p-2.5 rounded-lg w-full sm:w-28 text-center font-bold text-gray-800 transition-all font-mono shadow-sm bg-white"
                />
                <button
                  onClick={handleSaveShipping}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 font-bold transition-all shadow-sm shadow-gray-900/20 whitespace-nowrap active:scale-95 flex items-center gap-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col flex-1 h-[450px]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                  <PackageCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Recent Orders
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mx-2 px-2">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <ShoppingCart size={48} className="opacity-20" />
                  <p className="font-medium">No orders yet.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {orders
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map((order) => (
                      <li
                        key={order.id}
                        className="group flex flex-col p-5 rounded-xl border border-gray-100 bg-white hover:bg-purple-50/30 hover:border-purple-100 transition-all cursor-pointer shadow-sm hover:shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="font-extrabold text-gray-900 block text-lg mb-1">
                              Order #{order.id?.toString().slice(0, 6)}
                            </span>
                            <span className="text-sm font-semibold text-gray-600 flex items-center gap-1.5">
                              <UserCheck size={14} className="text-blue-500" />{" "}
                              {order.details.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-700 font-black text-lg bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg inline-block shadow-sm">
                              EGP {order.total}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100/80">
                          <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                            {new Date(order.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          <div className="flex items-center gap-1 text-xs font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity group-hover:-translate-x-1 duration-300">
                            Details <ArrowRight size={14} />
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full lg:min-h-[600px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Recent Users</h3>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
              Manage
            </span>
          </div>

          <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 -mx-2 px-2">
            {users.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <Users size={48} className="opacity-20" />
                <p className="font-medium">No users registered yet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {users
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((user) => (
                    <li
                      key={user.id}
                      className="p-4 rounded-xl border border-gray-100 bg-white flex justify-between items-center hover:bg-blue-50/30 hover:border-blue-100 hover:shadow-sm transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-wider shadow-sm border ${
                          user.role === "admin" || user.role === "staff"
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `,
        }}
      />
    </div>
  );
}

export default Dashboard;
