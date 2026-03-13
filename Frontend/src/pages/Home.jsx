import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Star,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "../components/Hero";
import { fetchTopProducts } from "../api/productApi";
import Loader from "../components/Loader";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const categoriesRef = useRef(null);
  const featuredRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeatured = async () => {
      try {
        const data = await fetchTopProducts(4);
        setFeaturedProducts(data);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    getFeatured();
  }, []);

  useEffect(() => {
    // Reveal categories on scroll
    const categories = categoriesRef.current.querySelectorAll(".category-card");
    gsap.fromTo(
      categories,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 80%",
        },
      },
    );

    // Reveal featured section
    if (!loading && featuredProducts.length > 0) {
      gsap.fromTo(
        featuredRef.current.querySelectorAll(".featured-item"),
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 70%",
          },
        },
      );
    }
  }, [loading, featuredProducts]);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* Hero Section */}
      {/* Hero Section */}
      <Hero products={featuredProducts} loading={loading} />

      {/* Stats/Quick Features */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FeatureItem
              icon={<Zap size={20} />}
              title="Fast Delivery"
              desc="Next day delivery standard"
            />
            <FeatureItem
              icon={<Shield size={20} />}
              title="Secure Checkout"
              desc="Encrypted payment processing"
            />
            <FeatureItem
              icon={<Star size={20} />}
              title="Premium Quality"
              desc="Handpicked artisan products"
            />
            <FeatureItem
              icon={<TrendingUp size={20} />}
              title="New Every Week"
              desc="Fresh arrivals on Mondays"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24" ref={categoriesRef}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                Shop by category
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover our curated collections designed for modern living.
                From essential tech to home aesthetics.
              </p>
            </div>
            <Link
              to="/products"
              className="group flex items-center gap-2 font-semibold hover:text-primary transition-colors"
            >
              View All Collections{" "}
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard
              to="/category/laptops"
              title="Premium Laptops"
              img="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop"
              span="md:col-span-2"
            />
            <CategoryCard
              to="/category/smartphones"
              title="Mobile Tech"
              img="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop"
            />
            <CategoryCard
              to="/category/fragrances"
              title="Luxury Scents"
              img="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop"
            />
            <CategoryCard
              to="/category/home-decoration"
              title="Minimalist Living"
              img="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000&auto=format&fit=crop"
              span="md:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-24 bg-secondary/30" ref={featuredRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
              New Season
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Featured Arrivals
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, idx) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={(
                    product.discountPrice || product.price
                  ).toLocaleString()}
                  category={product.category}
                  img={
                    product.images?.[0] ||
                    product.image ||
                    "https://via.placeholder.com/400"
                  }
                  isNew={idx === 0}
                  isHot={idx === 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner / Experience Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative h-[600px] rounded-4xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Premium Experience"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-widest mb-6 max-w-4xl">
                BEYOND ORDINARY TECHNOLOGY
              </h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10">
                Crafted for those who appreciate the intersection of high
                performance and sculptural aesthetics.
              </p>
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300 transform active:scale-95">
                Explore the Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Stay ahead of the curve
          </h3>
          <p className="text-muted-foreground text-lg mb-10">
            Join 50,000+ tech enthusiasts and get exclusive early access to our
            limited runs.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full max-w-md bg-secondary border-none rounded-full px-8 py-4 focus:ring-1 focus:ring-primary/20"
            />
            <button className="whitespace-nowrap bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold hover:opacity-90 transition-opacity w-full sm:w-auto">
              Subscribe Now
            </button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground italic">
            No spam. Just beauty and tech. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};

/* Internal Components */

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex flex-col gap-4">
    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">
        {title}
      </h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const CategoryCard = ({ to, title, img, span = "" }) => (
  <Link
    to={to}
    className={`category-card group relative h-80 rounded-3xl overflow-hidden ${span}`}
  >
    <img
      src={img}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      alt={title}
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
    <div className="absolute bottom-6 left-8">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
        Shop Now{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  </Link>
);

const ProductItem = ({ id, name, price, category, img, isNew, isHot }) => (
  <div className="featured-item group flex flex-col">
    <Link
      to={`/product/${id}`}
      className="relative aspect-4/5 overflow-hidden rounded-2xl bg-secondary mb-4"
    >
      <img
        src={img}
        className="h-full w-full object-contain p-4 mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110"
        alt={name}
      />
      {isNew && (
        <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
          Newest
        </span>
      )}
      {isHot && (
        <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
          Trending
        </span>
      )}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
        <button className="w-full bg-background text-foreground py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2">
          <ShoppingBag size={16} /> Quick Shop
        </button>
      </div>
    </Link>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
        {category}
      </span>
      <h3 className="font-bold text-lg leading-tight truncate">
        <Link
          to={`/product/${id}`}
          className="hover:opacity-70 transition-opacity"
        >
          {name}
        </Link>
      </h3>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xl font-medium">₹{price}</span>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <ExternalLink size={14} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  </div>
);

export default Home;
