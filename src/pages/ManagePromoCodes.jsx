import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function ManagePromoCodes() {
  const { promoCodes, addPromoCode, deletePromoCode } = useShop();
  const [newCode, setNewCode] = useState("");
  const [discount, setDiscount] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !discount) {
      toast.error("Please fill in both fields");
      return;
    }
    if (promoCodes.some((p) => p.code === newCode.trim().toUpperCase())) {
      toast.error("Promo code already exists");
      return;
    }
    addPromoCode(newCode.trim(), discount);
    setNewCode("");
    setDiscount("");
    toast.success("Promo code added successfully");
  };

  const handleDelete = (code) => {
    if (window.confirm(`Are you sure you want to delete "${code}"?`)) {
      deletePromoCode(code);
      toast.success("Promo code deleted");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Promo Codes</h2>

      {/* Add Promo Code */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold mb-4 text-gray-700">Create New Promo Code</h3>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Code
            </label>
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. SUMMER50"
              className="w-full border p-2 rounded-xl uppercase font-mono tracking-widest focus:ring-2 focus:ring-yellow-400 border-gray-200 outline-none"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 10"
              min="1"
              max="100"
              className="w-full border p-2 rounded-xl focus:ring-2 focus:ring-yellow-400 border-gray-200 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-yellow-500 text-black px-8 py-2 rounded-xl font-bold hover:bg-yellow-600 transition-colors h-[42px]"
            >
              Add Code
            </button>
          </div>
        </form>
      </div>

      {/* List Promo Codes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <th className="p-4">Promo Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((promo, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 uppercase font-mono font-bold tracking-widest text-gray-700">
                  {promo.code}
                </td>
                <td className="p-4 font-bold text-green-600">
                  {promo.discount}% OFF
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(promo.code)}
                    className="text-red-600 hover:text-red-800 bg-red-50 px-4 py-1.5 rounded-xl border border-red-100 text-xs font-bold transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan="3" className="p-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <span className="text-3xl">🎫</span>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      No active promo codes
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePromoCodes;
