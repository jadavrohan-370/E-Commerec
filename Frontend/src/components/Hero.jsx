import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroCanvas from "./HeroCanvas";
import gsap from "gsap";

const Hero = ({ products = [], loading }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [products]);

  const activeProduct = products[activeIndex];

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX - window.innerWidth / 2) / 60;
      const y = (clientY - window.innerHeight / 2) / 60;

      gsap.to(textRef.current, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 1.5,
        ease: "power2.out",
      });

      if (buttonRef.current) {
        const bound = buttonRef.current.getBoundingClientRect();
        const bX = bound.left + bound.width / 2;
        const bY = bound.top + bound.height / 2;
        const distance = Math.hypot(clientX - bX, clientY - bY);

        if (distance < 250) {
          gsap.to(buttonRef.current, {
            x: (clientX - bX) * 0.3,
            y: (clientY - bY) * 0.3,
            duration: 0.6,
            ease: "power2.out",
          });
        } else {
          gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-screen w-full overflow-hidden bg-background flex flex-col pt-24"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
        <div className="absolute inset-0 bg-radial-at-t from-transparent via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 grow pb-12">
        {/* Textual Utility Content */}
        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
          >
            <Sparkles size={14} className="text-primary fill-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              Trending Collections 2026
            </span>
          </Motion.div>

          <div ref={textRef}>
            <Motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8"
            >
              Ultimate <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-500 to-blue-600">
                Experience<span className="text-foreground">.</span>
              </span>
            </Motion.h1>
          </div>

          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium mb-12 leading-relaxed mx-auto lg:mx-0"
          >
            Curating the finest electronics and lifestyle pieces for the digital
            connoisseur. absolute performance meets sculptural aesthetics.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
          >
            <Link to="/products">
              <button
                ref={buttonRef}
                className="group relative bg-primary text-primary-foreground px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Shop Catalog{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </span>
              </button>
            </Link>

            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="user"
                  />
                </div>
              ))}
              <div className="pl-6 flex flex-col justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  50k+ Members
                </span>
                <div className="flex gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={10} className="fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Dynamic Product Showcase */}
        <div className="flex-1 w-full order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {loading ? (
              <div
                key="loader"
                className="aspect-square rounded-[60px] bg-secondary/20 animate-pulse"
              />
            ) : (
              <Motion.div
                key={activeProduct?._id || "default"}
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="relative aspect-square flex items-center justify-center"
              >
                {/* Product Platform */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[80%] h-[30%] bg-primary/20 blur-[100px] rounded-full translate-y-1/2" />
                </div>

                {/* Main Product Image */}
                <Link
                  to={`/product/${activeProduct?._id}`}
                  className="relative group select-none"
                >
                  <img
                    src={
                      activeProduct?.images?.[0] ||
                      "https://via.placeholder.com/800"
                    }
                    alt={activeProduct?.name}
                    className="w-full max-w-[600px] h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Floating Specs Labels */}
                  <Motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-4 -right-8 bg-background/80 backdrop-blur-md border p-4 rounded-2xl shadow-xl border-white/10 hidden md:block"
                  >
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">
                      New Arrival
                    </p>
                    <p className="font-bold text-sm tracking-tighter truncate max-w-[150px]">
                      {activeProduct?.name}
                    </p>
                    <p className="text-xl font-black text-foreground">
                      ₹{activeProduct?.price.toLocaleString()}
                    </p>
                  </Motion.div>

                  <Motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -bottom-4 -left-8 bg-background/80 backdrop-blur-md border p-4 rounded-2xl shadow-xl border-white/10 hidden md:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Zap size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                          Category
                        </p>
                        <p className="font-bold text-xs">
                          {activeProduct?.category}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                </Link>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Feature Footer */}
      <div className="bg-secondary/5 border-t border-border/50 py-12 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FeatureItem
              icon={<Zap />}
              title="Hyper-Fast Delivery"
              desc="Next day shipping standard"
            />
            <FeatureItem
              icon={<ShieldCheck />}
              title="Encrypted Matrix"
              desc="100% Secure token payments"
            />
            <FeatureItem
              icon={<Star />}
              title="Artisan Curated"
              desc="Only the peak of technology"
            />
            <FeatureItem
              icon={<Sparkles />}
              title="Flash Updates"
              desc="New arrivals every 48 hours"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-5 group">
    <div className="w-12 h-12 rounded-2xl bg-background border flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div className="flex flex-col">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">
        {title}
      </h4>
      <p className="text-[10px] text-muted-foreground font-medium">{desc}</p>
    </div>
  </div>
);

export default Hero;
