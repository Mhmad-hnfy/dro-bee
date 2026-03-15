import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { toast } from "sonner";

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, clearCart } = useShop();
  
  const [status, setStatus] = useState("processing"); // processing, success, failed
  const [txnDetails, setTxnDetails] = useState(null);

  useEffect(() => {
    const success = searchParams.get("success") === "true";
    const txnId = searchParams.get("id");
    const orderId = searchParams.get("order");

    if (success) {
      setStatus("success");
      setTxnDetails({ id: txnId, order: orderId });
      clearCart(); // Payment was successful, clear the cart locally
      toast.success("Payment Received Successfully!");
    } else {
      setStatus("failed");
      toast.error("Payment was declined or cancelled.");
    }
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex justify-center">
          {status === "processing" && (
            <div className="w-20 h-20 border-4 border-yellow-200 border-t-yellow-400 rounded-full animate-spin"></div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-green-100">
              ✓
            </div>
          )}
          {status === "failed" && (
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-red-100">
              ✕
            </div>
          )}
        </div>

        <h2 className="text-3xl font-black text-gray-900 uppercase italic mb-2 tracking-tight">
          {status === "processing" && "Verifying Payment..."}
          {status === "success" && "Success!"}
          {status === "failed" && "Failed"}
        </h2>
        
        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-8 px-4">
          {status === "processing" && "We are confirming your transaction with Paymob."}
          {status === "success" && "Your order has been confirmed and is being processed."}
          {status === "failed" && "Something went wrong with your payment. Please try again."}
        </p>

        {status === "success" && txnDetails && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-gray-900 font-mono">{txnDetails.id}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-gray-400">Paymob Order</span>
              <span className="text-gray-900 font-mono">{txnDetails.order}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {status === "success" ? (
            <Link
              to="/profile"
              className="block w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              View My Orders
            </Link>
          ) : (
            <Link
              to="/checkout"
              className="block w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              Return to Checkout
            </Link>
          )}
          
          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentCallback;
