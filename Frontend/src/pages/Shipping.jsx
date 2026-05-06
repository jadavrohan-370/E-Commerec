import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Package } from "lucide-react";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;

  const [fullName, setFullName] = useState(shippingAddress?.fullName || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ fullName, street, city, postalCode, country }));
    navigate("/payment");
  };

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <CheckoutSteps step1 step2 />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16">
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/20 rounded-[2.5rem] border p-8 md:p-12"
            >
              <div className="flex items-center gap-4 mb-10 border-b pb-8 border-border/50">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                   <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tighter uppercase">Shipping Details</h2>
                  <p className="text-sm text-muted-foreground font-medium">Where should we deliver your selection?</p>
                </div>
              </div>

              <form onSubmit={submitHandler} className="space-y-8">
                <div className="space-y-4">
                   <label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                   <input
                     type="text"
                     id="fullName"
                     required
                     className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                     placeholder="E.g. Alexander Pierce"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                   />
                </div>

                <div className="space-y-4">
                   <label htmlFor="street" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                   <input
                     type="text"
                     id="street"
                     required
                     className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                     placeholder="12/A Innovation Street"
                     value={street}
                     onChange={(e) => setStreet(e.target.value)}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <label htmlFor="city" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                     <input
                       type="text"
                       id="city"
                       required
                       className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                       placeholder="Mumbai"
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                     />
                   </div>
                   <div className="space-y-4">
                     <label htmlFor="postalCode" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                     <input
                       type="text"
                       id="postalCode"
                       required
                       className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                       placeholder="400001"
                       value={postalCode}
                       onChange={(e) => setPostalCode(e.target.value)}
                     />
                   </div>
                </div>

                <div className="space-y-4">
                   <label htmlFor="country" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Country</label>
                   <input
                     type="text"
                     id="country"
                     required
                     className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                     placeholder="India"
                     value={country}
                     onChange={(e) => setCountry(e.target.value)}
                   />
                </div>

                <div className="pt-8 flex justify-end">
                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-3 bg-primary text-primary-foreground px-12 py-5 rounded-2xl font-bold shadow-2xl hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    Proceed to Payment
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
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

export default Shipping;
