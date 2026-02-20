import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import Loading from "../assets/Components/Loading";

function OrderReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, t } = useShop();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state && location.state.orderId) {
      const foundOrder =
        orders.find((o) => o.id === location.state.orderId) ||
        orders.find((o) => o.id === location.state.order.id);
      setOrder(foundOrder || location.state.order);
    } else if (location.state && location.state.order) {
      setOrder(location.state.order);
    }
  }, [location.state, orders]);

  useEffect(() => {
    if (order) {
      // Auto-trigger print when invoice loads as per user request
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (!order) {
    return <Loading fullScreen message={t("receipt.generating")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 print:bg-white print:p-0">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-gray-200/50 max-w-2xl w-full border border-gray-100 print:shadow-none print:border-none print:max-w-none">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-1">
              Dro<span className="text-yellow-500">Bee</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
              {t("receipt.title")}
            </p>
          </div>
          <div className="text-right md:text-right text-gray-500 text-xs font-medium leading-relaxed">
            <p className="font-black text-gray-900 uppercase mb-1">
              {t("receipt.storeInfo")}
            </p>
            <p>123 Commerce St, Cairo, Egypt</p>
            <p>support@drobee.com</p>
            <p>+20 123 456 7890</p>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2">
              {t("receipt.billedTo")}
            </h3>
            <div className="space-y-1">
              <p className="font-black text-gray-900 text-lg uppercase leading-none">
                {order.details.name}
              </p>
              <p className="text-gray-500 text-sm font-medium">
                {order.details.phone1}
              </p>
              {order.details.phone2 && (
                <p className="text-gray-500 text-sm font-medium">
                  {order.details.phone2}
                </p>
              )}
              <p className="text-gray-400 text-sm font-medium leading-relaxed mt-2 max-w-[200px]">
                {order.details.address}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-2">
              {t("receipt.invoiceDetails")}
            </h3>
            <div className="space-y-1">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">
                {t("receipt.orderId")}:{" "}
                <span className="text-gray-900 font-black">#{order.id}</span>
              </p>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">
                {t("receipt.date")}:{" "}
                <span className="text-gray-900 font-black">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-tighter">
                {t("receipt.payment")}:
                <span className="text-green-600 font-black ml-1">
                  {order.details.paymentMethod === "cod" && t("receipt.cash")}
                  {order.details.paymentMethod === "card" &&
                    t("receipt.creditCard")}
                  {order.details.paymentMethod === "wallet" &&
                    `${t("receipt.wallet")} (${order.details.walletType})`}
                  {order.details.paymentMethod === "paypal" &&
                    t("receipt.paypal")}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("receipt.description")}
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  {t("receipt.qty")}
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  {t("receipt.price")}
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  {t("receipt.total")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800 text-sm">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">
                      {item.category}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600 text-sm">
                    {item.qty}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-500 text-sm">
                    EGP{" "}
                    {parseFloat(
                      item.price.toString().replace(/[^\d.]/g, ""),
                    ).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900 text-sm">
                    EGP{" "}
                    {(
                      parseFloat(item.price.toString().replace(/[^\d.]/g, "")) *
                      item.qty
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Breakdown */}
        <div className="flex flex-col items-end border-t border-gray-100 pt-8 gap-3">
          <div className="w-full max-w-[240px] flex justify-between items-center text-sm">
            <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
              {t("receipt.subtotal")}
            </span>
            <span className="font-bold text-gray-600">
              EGP{" "}
              {(
                order.total - (order.shippingCost || order.shipping_cost || 0)
              ).toFixed(2)}
            </span>
          </div>
          <div className="w-full max-w-[240px] flex justify-between items-center text-sm">
            <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
              {t("receipt.shipping")}
            </span>
            <span className="font-bold text-gray-600">
              EGP{" "}
              {parseFloat(
                order.shippingCost || order.shipping_cost || 0,
              ).toFixed(2)}
            </span>
          </div>
          <div className="w-full max-w-[240px] flex justify-between items-center bg-yellow-400 p-4 rounded-xl mt-2 shadow-lg shadow-yellow-100">
            <span className="font-black text-black uppercase tracking-tighter italic">
              {t("receipt.totalAmount")}
            </span>
            <span className="text-xl font-black text-black">
              EGP {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Print & Actions */}
        <div className="print:hidden mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            {t("receipt.print")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
          >
            {t("receipt.continue")}
          </button>
        </div>

        <div className="mt-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
          {t("receipt.thankYou")}
        </div>
      </div>
    </div>
  );
}

export default OrderReceipt;
