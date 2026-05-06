import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../store/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { motion } from "framer-motion";
import { CreditCard, Wallet, ArrowRight, Package } from "lucide-react";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  useEffect(() => {
    if (!shippingAddress.street) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <CheckoutSteps step1 step2 step3 />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/20 rounded-[2.5rem] border p-8 md:p-12 text-center"
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-4">Payment Method</h2>
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

                  <div 
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
                  </div>
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

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary/10 border rounded-4xl p-8 sticky top-32"
            >
              <div className="flex items-center gap-4 mb-8 border-b pb-6 border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="font-bold uppercase tracking-widest text-xs">
                    Order Summary
                  </h2>
                  <p className="text-xs text-muted-foreground">{cartItems.length} items</p>
                </div>
              </div>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={item._id || index} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-background rounded-xl border p-2 shrink-0">
                      <img
                        src={item.image || item.images?.[0]}
                        className="w-full h-full object-contain mix-blend-multiply"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold tracking-tight text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(item.qty * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold tracking-tighter">
                    ₹{Number(itemsPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
