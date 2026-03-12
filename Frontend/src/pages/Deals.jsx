import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Tag, 
  Zap, 
  Clock, 
  ArrowRight, 
  Percent,
  TrendingDown,
  ChevronRight
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import Product from "../components/Product";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await axios.get("https://dummyjson.com/products?limit=50");
        // Simulate "Deals" by filtering products with high discount or specific logic
        const mappedDeals = data.products
          .filter(p => p.discountPercentage > 15)
          .map(p => ({
            _id: p.id,
            name: p.title,
            brand: p.brand || "Premium Tech",
            price: Math.round(p.price * 82), // USD to INR
            discountPrice: Math.round((p.price * (1 - p.discountPercentage / 100)) * 82),
            images: p.images,
            rating: p.rating,
            numberOfReviews: Math.floor(Math.random() * 500) + 50,
            category: p.category
          }));
        setDeals(mappedDeals);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch deals", err);
        setLoading(false);
      }
    };

    fetchDeals();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="relative rounded-[50px] overflow-hidden bg-slate-900 h-[600px] flex items-center">
          <div className="absolute inset-0">
             <img
               src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop"
               className="w-full h-full object-cover opacity-50"
               alt="Deals Background"
             />
             <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/40 to-transparent" />
             <div className="absolute -bottom-10 -left-10 bg-background border p-8 rounded-[40px] shadow-2xl hidden lg:block backdrop-blur-xl"></div>
          </div>

          <div className="relative z-10 p-12 md:p-24 max-w-3xl">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8"
            >
              <Zap size={14} fill="currentColor" /> Limted Time Opportunity
            </Motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
               Ultimate <span className="text-amber-500 italic">Savings</span> Event
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              Unleash productivity with premium electronics at unprecedented prices. 
              Our deepest discounts of the season are here for a final countdown.
            </p>

            <div className="flex items-center gap-6">
               <div className="flex gap-4">
                 <TimerBox val={timeLeft.h} label="HRS" />
                 <TimerBox val={timeLeft.m} label="MIN" />
                 <TimerBox val={timeLeft.s} label="SEC" />
               </div>
               <div className="h-16 w-px bg-white/20 hidden md:block" />
               <div className="hidden md:block">
                 <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Ends In</p>
                 <p className="text-white font-black text-xl">Midnight Tonight</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="container mx-auto px-4 mb-24">
        <div className="flex items-end justify-between mb-12 px-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4 flex items-center gap-3">
              <Percent className="text-amber-500" /> Flash Deals
            </h2>
            <p className="text-muted-foreground">Highest discounts currently live across the store.</p>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest">
            View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 bg-secondary/20 rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {deals.slice(0, 12).map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Specialty Sections */}
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
         <PromoCard 
           title="Bundle & Save"
           desc="Get the complete setup. Mix and match laptops with peripherals and save an extra 15%."
           btn="Shop Bundles"
           color="bg-purple-600"
           img="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop"
         />
         <PromoCard 
           title="Clearance Hub"
           desc="Last chance items at liquidation prices. Up to 70% off on previous generation flagship models."
           btn="Explore Outlet"
           color="bg-slate-900"
           img="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop"
         />
      </section>
    </div>
  );
};

const TimerBox = ({ val, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black text-white border border-white/10 mb-2">
      {val.toString().padStart(2, '0')}
    </div>
    <span className="text-[10px] font-black tracking-widest text-white/40">{label}</span>
  </div>
);

const PromoCard = ({ title, desc, btn, img }) => (
  <div className={`relative h-[450px] rounded-[50px] overflow-hidden group border shadow-xl`}>
    <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" alt={title} />
    <div className={`absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent`} />
    
    <div className="absolute inset-0 p-12 flex flex-col justify-end">
       <h3 className="text-4xl font-bold tracking-tighter text-white mb-4">{title}</h3>
       <p className="text-white/70 mb-8 max-w-sm leading-relaxed">{desc}</p>
       <button className="w-fit bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-colors flex items-center gap-2 group/btn">
         {btn} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
       </button>
    </div>
  </div>
);

export default Deals;
