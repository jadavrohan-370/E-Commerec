import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Laptop, 
  Smartphone, 
  Tv, 
  Speaker, 
  Watch, 
  Wind, 
  Refrigerator, 
  Waves, 
  Flame,
  ArrowRight 
} from "lucide-react";
import gsap from "gsap";

const categories = [
  { name: "Laptops", id: "Laptop", icon: <Laptop size={32} />, color: "bg-blue-500/10 text-blue-500", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop" },
  { name: "Mobile Phones", id: "Mobile Phone", icon: <Smartphone size={32} />, color: "bg-purple-500/10 text-purple-500", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop" },
  { name: "Televisions", id: "Television", icon: <Tv size={32} />, color: "bg-red-500/10 text-red-500", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1000&auto=format&fit=crop" },
  { name: "Premium Audio", id: "Speakers", icon: <Speaker size={32} />, color: "bg-amber-500/10 text-amber-500", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" },
  { name: "Smart Watches", id: "Smart Watch", icon: <Watch size={32} />, color: "bg-emerald-500/10 text-emerald-500", img: "https://images.unsplash.com/photo-1544117518-30dd5f2f309d?q=80&w=1000&auto=format&fit=crop" },
  { name: "Air Conditioners", id: "Air Conditioner", icon: <Wind size={32} />, color: "bg-teal-500/10 text-teal-500", img: "https://images.unsplash.com/photo-1631541909061-71e349d1396c?q=80&w=1000&auto=format&fit=crop" },
  { name: "Refrigerators", id: "Refrigerator", icon: <Refrigerator size={32} />, color: "bg-indigo-500/10 text-indigo-500", img: "https://images.unsplash.com/photo-1571175439150-59247087c3d9?q=80&w=1000&auto=format&fit=crop" },
  { name: "Washing Machines", id: "Washing Machine", icon: <Waves size={32} />, color: "bg-cyan-500/10 text-cyan-500", img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=1000&auto=format&fit=crop" },
  { name: "Microwave Ovens", id: "Microwave Oven", icon: <Flame size={32} />, color: "bg-orange-500/10 text-orange-500", img: "https://images.unsplash.com/photo-1574265353392-692121b6a782?q=80&w=1000&auto=format&fit=crop" },
];

const Categories = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current.querySelectorAll(".category-card");
    gsap.fromTo(cards, 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out" 
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mb-16 px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Explore <span className="text-primary italic">Collections</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover our meticulously curated selection of world-class electronics, 
            designed to elevate your lifestyle and empower your productivity.
          </p>
        </div>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat, idx) => (
            <Link 
              key={idx}
              to={`/category/${cat.id}`}
              className="category-card group relative h-96 rounded-[40px] overflow-hidden border transition-all hover:shadow-2xl hover:shadow-primary/5 shadow-sm"
            >
              {/* Background Image */}
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60"
                alt={cat.name}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-between">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${cat.color} backdrop-blur-sm shadow-xl`}>
                  {cat.icon}
                </div>
                
                <div>
                  <h3 className="text-4xl font-bold tracking-tighter mb-4 group-hover:translate-x-2 transition-transform duration-500">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Explore Collection <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
