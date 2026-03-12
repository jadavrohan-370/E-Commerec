import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import { motion } from "framer-motion";
import { CreditCard, Wallet, ArrowRight } from "lucide-react";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.street) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <CheckoutSteps step1 step2 step3 />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-16 bg-secondary/20 rounded-[2.5rem] border p-12 md:p-16 text-center"
        >
          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Payment Method</h2>
            <p className="text-muted-foreground font-medium">Select your preferred way to finalize the acquisition.</p>
          </div>

          <form onSubmit={submitHandler} className="max-w-md mx-auto">
            <div className="space-y-6 mb-12">
              <label 
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  paymentMethod === "Razorpay" 
                  ? "bg-background border-primary shadow-xl scale-[1.02]" 
                  : "bg-secondary/40 border-transparent hover:border-muted"
                }`}
              >
                <div className="flex items-center gap-6">
                   <div className={`p-4 rounded-2xl ${paymentMethod === "Razorpay" ? "bg-primary text-white" : "bg-muted text-muted-foreground transition-colors"}`}>
                      <CreditCard size={28} />
                   </div>
                   <div className="text-left">
                      <span className="block font-bold text-lg tracking-tight">Digital Payment</span>
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Razorpay / UPI / Cards</span>
                   </div>
                </div>
                <input
                  type="radio"
                  className="hidden"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === "Razorpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Razorpay" ? "border-primary" : "border-muted"}`}>
                   {paymentMethod === "Razorpay" && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
              </label>

              <label 
                className={`flex items-center justify-between p-6 rounded-3xl border-2 opacity-50 cursor-not-allowed ${
                  paymentMethod === "Crypto" ? "border-primary shadow-xl" : "bg-secondary/40 border-transparent"
                }`}
              >
                <div className="flex items-center gap-6">
                   <div className="p-4 rounded-2xl bg-muted text-muted-foreground">
                      <Wallet size={28} />
                   </div>
                   <div className="text-left">
                      <span className="block font-bold text-lg tracking-tight">Crypto Assets</span>
                      <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Coming Soon</span>
                   </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-2xl shadow-2xl hover:opacity-90 transition-all flex justify-center items-center gap-3 active:scale-[0.98] group"
            >
              Confirm Selection
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
