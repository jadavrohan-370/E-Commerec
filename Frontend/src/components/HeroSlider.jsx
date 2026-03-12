import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2000&auto=format&fit=crop",
    title: "The Zenith of Computing",
    subtitle: "Engineered for pure performance. Redefining what workspace elegance means.",
    category: "Pro Tech",
    tagline: "Unleash Productivity",
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop",
    title: "Acoustic Perfection",
    subtitle: "Precision-tuned drivers. Carbon fiber aesthetics. Zero compromises.",
    category: "Master Audio",
    tagline: "Hear Everything",
  },
  {
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2000&auto=format&fit=crop",
    title: "Sculptural Living",
    subtitle: "Minimalist lighting designed for the contemporary home. Art meets function.",
    category: "Home Essence",
    tagline: "Illuminate Space",
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Reset state before "In" animation
    gsap.set([categoryRef.current, titleRef.current, subtitleRef.current, buttonsRef.current], {
      y: 30,
      opacity: 0
    });

    // In animation for current slide
    tl.to([categoryRef.current, titleRef.current, subtitleRef.current, buttonsRef.current], { 
      y: 0, 
      opacity: 1, 
      duration: 1, 
      stagger: 0.1, 
      ease: "expo.out",
      delay: 0.3
    });
  }, [current]);

  const nextSlide = React.useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Basic auto-slide
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-background" ref={containerRef}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover transition-transform duration-10000 group-hover:scale-110"
              style={{ transform: index === current ? 'scale(1.1)' : 'scale(1)' }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent dark:from-slate-950/95" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 md:px-12 flex flex-col justify-center">
            <div className="max-w-3xl">
              <span 
                ref={index === current ? categoryRef : null}
                className="inline-block text-primary font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs mb-8 reveal-text drop-shadow-md py-2 px-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full"
              >
                {slide.category} <span className="mx-4 text-white/30 font-light">|</span> {slide.tagline}
              </span>
              <h1 
                ref={index === current ? titleRef : null}
                className="text-6xl md:text-9xl font-bold text-white tracking-tighter mb-8 leading-[0.9] reveal-text drop-shadow-2xl"
              >
                {slide.title}
              </h1>
              <p 
                ref={index === current ? subtitleRef : null}
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-xl font-medium leading-relaxed drop-shadow-lg"
              >
                {slide.subtitle}
              </p>
              <div 
                ref={index === current ? buttonsRef : null}
                className="flex flex-wrap items-center gap-6"
              >
                <button className="bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-3 group">
                  EXPLORE NOW
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="w-16 h-px bg-white/30 hidden md:block" />
                <button className="text-white hover:text-primary transition-colors font-bold tracking-widest text-xs">
                  VIEW COLLECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-12 right-4 md:right-12 z-20 flex flex-col gap-4">
        <button
          onClick={prevSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Page Numbers */}
      <div className="absolute bottom-12 left-4 md:left-12 z-20 flex items-end gap-1 font-bold text-white">
        <span className="text-4xl">0{current + 1}</span>
        <span className="text-lg text-white/40 mb-1">/ 0{slides.length}</span>
      </div>

      {/* Modern Progress Fill */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full z-20">
        <div 
          className="h-full bg-primary transition-all duration-8000 linear"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;
