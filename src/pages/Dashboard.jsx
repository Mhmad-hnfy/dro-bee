import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function Dashboard() {
  const { users, orders, products, settings, updateShippingCost } = useShop();
  const [shipping, setShipping] = useState(settings.shippingCost);

  const handleSaveShipping = async () => {
    await updateShippingCost(shipping);
    toast.success("Shipping cost updated!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-semibold uppercase">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Settings */}
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-lg font-bold mb-4">Settings</h3>
          <div className="flex items-center gap-4">
            <label className="text-gray-700">Shipping Cost (EGP):</label>
            <input
              type="number"
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="border p-2 rounded w-24"
            />
            <button
              onClick={handleSaveShipping}
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
            >
              Save
            </button>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded shadow-md max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Recent Users</h3>
          {users.length === 0 ? (
            <p className="text-gray-500">No users registered yet.</p>
          ) : (
            <ul className="space-y-3">
              {users
                .slice()
                .reverse()
                .slice(0, 5)
                .map((user) => (
                  <li
                    key={user.id}
                    className="border-b pb-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        user.role === "staff"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded shadow-md max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders
                .slice()
                .reverse()
                .slice(0, 5)
                .map((order) => (
                  <li key={order.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Order #{order.id}</span>
                      <span className="text-green-600 font-bold">
                        EGP {order.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      User: {order.details.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleString()}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
