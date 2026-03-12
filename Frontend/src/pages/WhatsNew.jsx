import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  ArrowUpRight,
  Monitor,
  Smartphone,
  Watch,
  Plus
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import axios from "axios";
import Product from "../components/Product";

const WhatsNew = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        const { data } = await axios.get("https://dummyjson.com/products?limit=50");
        // Sort by id descending as a proxy for newest
        const mapped = data.products
          .sort((a, b) => b.id - a.id)
          .map(p => ({
            _id: p.id,
            name: p.title,
            brand: p.brand || "Nova Tech",
            price: Math.round(p.price * 82),
            images: p.images,
            rating: p.rating,
            numberOfReviews: Math.floor(Math.random() * 100),
            category: p.category
          }));
        setNewProducts(mapped);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchNew();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Editorial Header */}
      <section className="container mx-auto px-4 mb-24">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
             <Motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs mb-8"
             >
               <Sparkles size={14} className="fill-primary" /> The Frontier of Technology
             </Motion.div>
             <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-10 leading-[0.8] uppercase flex flex-col">
               <span>Future</span>
               <span className="text-primary italic">Now.</span>
             </h1>
             <p className="text-2xl text-muted-foreground max-w-lg mb-12 leading-relaxed tracking-tight">
               Discover our latest acquisitions. From flagship silicon to revolutionary displays, explore the products shaping tomorrow.
             </p>
             <div className="flex gap-4">
               <button className="bg-foreground text-background px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3">
                 Explore Now <ArrowUpRight size={20} />
               </button>
               <div className="p-5 border rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">24</div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">New Drops Today</span>
               </div>
             </div>
          </div>
          
          <div className="flex-1 order-1 md:order-2 relative">
             <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="New Tech"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent" />
             </div>
             {/* Abstract Floating Element */}
             <div className="absolute -bottom-10 -left-10 bg-background border p-8 rounded-[40px] shadow-2xl hidden lg:block backdrop-blur-xl">
                <div className="flex items-center gap-5 mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                      <Cpu size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-50">Latest Spec</p>
                      <p className="font-bold">M4 Pro Chips</p>
                   </div>
                </div>
                <div className="h-px bg-border mb-6" />
                <div className="flex gap-3">
                   <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold">RTX 5090 Ready</span>
                   <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold">120Hz OLED</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Categories Scroller */}
      <section className="container mx-auto px-4 mb-24 overflow-x-auto no-scrollbar">
         <div className="flex gap-6 pb-4">
            <CategoryPill icon={<Monitor size={20} />} label="Computing" active />
            <CategoryPill icon={<Smartphone size={20} />} label="Flagships" />
            <CategoryPill icon={<Watch size={20} />} label="Wearables" />
            <CategoryPill icon={<Layers size={20} />} label="Accessories" />
         </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tighter mb-12 flex items-center gap-4">
           Just <span className="text-primary">Arrived.</span>
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 bg-secondary/20 rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {newProducts.slice(0, 16).map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 mt-32">
        <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -mr-48 -mt-48" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -ml-48 -mb-48" />
           
           <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 relative z-10">
              Never miss a <span className="text-primary italic">drop.</span>
           </h2>
           <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12 relative z-10">
              Join 50k+ tech enthusiasts who receive early access to flagship launches and exclusive limited edition releases.
           </p>
           <form className="max-w-md mx-auto relative z-10 flex gap-4">
              <input 
                type="email" 
                placeholder="Secure your access..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white p-4 rounded-xl hover:scale-105 transition-transform">
                <Plus size={24} />
              </button>
           </form>
        </div>
      </section>
    </div>
  );
};

const CategoryPill = ({ icon, label, active }) => (
  <button className={`flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all whitespace-nowrap ${
    active ? 'bg-foreground text-background border-foreground shadow-xl' : 'hover:bg-secondary text-muted-foreground'
  }`}>
    {icon}
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

export default WhatsNew;
