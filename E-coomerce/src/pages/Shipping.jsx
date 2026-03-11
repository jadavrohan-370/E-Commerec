import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Navigation } from "lucide-react";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

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

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <CheckoutSteps step1 step2 />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-secondary/20 rounded-[2.5rem] border p-12 md:p-16"
        >
          <div className="flex items-center gap-4 mb-10 border-b pb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
               <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase">Shipping Details</h2>
              <p className="text-sm text-muted-foreground font-medium">Where should we deliver your selection?</p>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
               <input
                 type="text"
                 required
                 className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                 placeholder="E.g. Alexander Pierce"
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
               />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
               <input
                 type="text"
                 required
                 className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                 placeholder="12/A Innovation Street"
                 value={street}
                 onChange={(e) => setStreet(e.target.value)}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                 <input
                   type="text"
                   required
                   className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                   placeholder="Mumbai"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                 />
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                 <input
                   type="text"
                   required
                   className="w-full bg-background border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                   placeholder="400001"
                   value={postalCode}
                   onChange={(e) => setPostalCode(e.target.value)}
                 />
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Country</label>
               <input
                 type="text"
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
    </div>
  );
};

export default Shipping;
