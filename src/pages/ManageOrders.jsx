import React from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function ManageOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useShop();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
      <div className="space-y-4">
        {orders
          .slice()
          .reverse()
          .map((order) => (
            <div key={order.id} className="bg-white p-6 rounded shadow border">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-bold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.date).toLocaleString()}
                  </p>
                  <p className="text-sm">
                    User: {order.details.name} ({order.user.email || "Guest"})
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xl font-bold text-green-600">
                    EGP {order.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={async (e) =>
                        await updateOrderStatus(order.id, e.target.value)
                      }
                      className="border rounded text-sm p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={async () =>
                        await updateOrderStatus(order.id, "Cancelled")
                      }
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Cancel Order
                    </button>

                    <button
                      onClick={async () =>
                        await updateOrderStatus(order.id, "Delivered")
                      }
                      className="text-green-500 hover:text-green-700 text-sm"
                    >
                      Deliver Order
                    </button>

                    <button
                      onClick={async () =>
                        await updateOrderStatus(order.id, "Shipped")
                      }
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Ship Order
                    </button>

                    <button
                      onClick={async () =>
                        await updateOrderStatus(order.id, "Pending")
                      }
                      className="text-yellow-500 hover:text-yellow-700 text-sm"
                    >
                      Pending Order
                    </button>

                    <button
                      onClick={async () => {
                        if (window.confirm("Delete this order?")) {
                          await deleteOrder(order.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors font-medium text-xs border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="list-disc pl-5 text-sm mb-4">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} (x{item.qty}) - {item.price}
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold text-sm">Shipping Details:</h4>
                  <p className="text-sm text-gray-600">
                    {order.details.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone 1: {order.details.phone1}
                  </p>
                  {order.details.phone2 && (
                    <p className="text-sm text-gray-600">
                      Phone 2: {order.details.phone2}
                    </p>
                  )}

                  <h4 className="font-semibold text-sm mt-3">Payment Info:</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    Method:{" "}
                    {order.details.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment (Card)"}
                  </p>
                  {order.details.paymentMethod === "card" &&
                    order.details.cardDetails && (
                      <div className="text-xs bg-gray-100 p-2 rounded mt-1 border">
                        <p>
                          <strong>Holder:</strong>{" "}
                          {order.details.cardDetails.holderName}
                        </p>
                        <p>
                          <strong>Number:</strong>{" "}
                          {order.details.cardDetails.number}
                        </p>
                        <p>
                          <strong>Expiry:</strong>{" "}
                          {order.details.cardDetails.expiry} |{" "}
                          <strong>CVC:</strong> {order.details.cardDetails.cvc}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        {orders.length === 0 && (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;
