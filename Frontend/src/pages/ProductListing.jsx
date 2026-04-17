import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  X,
  RotateCcw,
  Check
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { fetchProducts } from "../api/productApi";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";

const categories = [
  'Air Conditioner', 'Television', 'Refrigerator', 'Washing Machine', 'Microwave Oven', 'Laptop', 'Mobile Phone', 'Speakers', 'Smart Watch'
];

const brands = ['Samsung', 'LG', 'Sony', 'Apple', 'Dell', 'HP', 'Bose', 'JBL', 'Xiaomi', 'OnePlus'];

const ProductListing = () => {
  const { category: urlCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state (initialized from URL)
  const [filters, setFilters] = useState({
    category: urlCategory || searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    price: searchParams.get("price") || "500000",
    rating: searchParams.get("rating") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Local state for slider to allow smooth sliding without immediate API calls
  const [localPrice, setLocalPrice] = useState(parseInt(filters.price));

  // Debounce price updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localPrice.toString() !== filters.price) {
        setFilters(prev => ({ 
          ...prev, 
          price: localPrice.toString(),
          page: 1 
        }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localPrice, filters.price]);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({ ...filters, limit: 12 });
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
      setTotalPages(Math.ceil(data.totalProducts / 12));
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Sync state with URL
  useEffect(() => {
    const newParams = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) newParams[key] = filters[key];
    });
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      price: "500000",
      rating: "",
      page: 1,
    });
    setLocalPrice(500000);
  };

  const pageTitle = filters.category || "All Collections";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      {/* Dynamic Header */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-4">
              {pageTitle}<span className="text-primary italic">.</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Exploring <span className="text-foreground font-bold">{totalProducts}</span> world-class pieces across {filters.brand || "premium"} brands.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center border rounded-2xl p-1 bg-secondary/30">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${viewMode === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground"}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${viewMode === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground"}`}
              >
                <ListIcon size={20} />
              </button>
            </div>
            
            <button 
              className="lg:hidden flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Global Range Controller - Visible on All Screens */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-secondary/10 border rounded-[40px] p-8 md:p-10 shadow-sm backdrop-blur-sm max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            <div className="shrink-0">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Price Matrix</h3>
              <p className="text-xs text-muted-foreground font-bold italic opacity-60">Fine-tune your investment range</p>
            </div>
            
            <div className="flex-1 space-y-8">
              <input 
                type="range"
                min={0} 
                max={500000} 
                step={1000}
                value={localPrice} 
                onChange={(e) => setLocalPrice(parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Range</span>
                  <span className="text-sm font-black">Up to ₹{localPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 bg-secondary/10 border rounded-[32px] p-8 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Filter Matrix</h3>
                 <button onClick={resetFilters} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 p-2 rounded-lg hover:bg-background transition-colors">
                   <RotateCcw size={12} /> Reset
                 </button>
              </div>

              <div className="space-y-12">
                <FilterGroup title="Categories">
                   <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <Chip 
                          key={cat} 
                          label={cat} 
                          active={filters.category === cat} 
                          onClick={() => updateFilter("category", filters.category === cat ? "" : cat)} 
                        />
                      ))}
                   </div>
                </FilterGroup>

                <FilterGroup title="Brands">
                   <div className="grid grid-cols-1 gap-2">
                      {brands.map(brand => (
                        <BrandOption 
                          key={brand} 
                          label={brand} 
                          active={filters.brand === brand} 
                          onClick={() => updateFilter("brand", filters.brand === brand ? "" : brand)} 
                        />
                      ))}
                   </div>
                </FilterGroup>



                <FilterGroup title="Min Performance">
                   <div className="flex gap-2">
                      {[4, 3, 2, 1].map(star => (
                        <RatingButton 
                          key={star} 
                          val={star} 
                          active={filters.rating == star} 
                          onClick={() => updateFilter("rating", filters.rating == star ? "" : star)} 
                        />
                      ))}
                   </div>
                </FilterGroup>
              </div>
            </div>
          </aside>

          {/* Product Feed */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-[450px] bg-secondary/20 rounded-[40px] animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : products.length > 0 ? (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-8"}>
                   {products.map(p => (
                     <Product key={p._id} product={p} />
                   ))}
                </div>

                {/* Advanced Multi-State Pagination */}
                {totalPages > 1 && (
                  <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                     <div className="flex items-center gap-2">
                        <PaginationButton 
                          onClick={() => {
                            updateFilter("page", filters.page - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          disabled={filters.page === 1}
                        >
                          <ChevronLeft size={20} />
                        </PaginationButton>
                        
                        <div className="flex items-center gap-2">
                           {(() => {
                             const pages = [];
                             const maxVisible = 5;
                             if (totalPages <= maxVisible) {
                               for (let i = 1; i <= totalPages; i++) pages.push(i);
                             } else {
                               pages.push(1);
                               let start = Math.max(2, filters.page - 1);
                               let end = Math.min(totalPages - 1, filters.page + 1);
                               if (filters.page <= 2) end = 3;
                               if (filters.page >= totalPages - 1) start = totalPages - 2;
                               
                               if (start > 2) pages.push("...");
                               for (let i = start; i <= end; i++) pages.push(i);
                               if (end < totalPages - 1) pages.push("...");
                               pages.push(totalPages);
                             }
                             
                             return pages.map((p, i) => (
                               p === "..." ? (
                                 <span key={`sep-${i}`} className="w-12 h-12 flex items-center justify-center text-muted-foreground opacity-30 font-black">...</span>
                               ) : (
                                 <button
                                   key={p}
                                   onClick={() => {
                                     updateFilter("page", p);
                                     window.scrollTo({ top: 0, behavior: 'smooth' });
                                   }}
                                   className={`w-12 h-12 rounded-2xl text-xs font-black uppercase transition-all duration-300 ${
                                     filters.page === p 
                                       ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110" 
                                       : "hover:bg-secondary text-muted-foreground"
                                   }`}
                                 >
                                   {p}
                                 </button>
                               )
                             ));
                           })()}
                        </div>

                        <PaginationButton 
                          onClick={() => {
                            updateFilter("page", filters.page + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          disabled={filters.page === totalPages}
                        >
                          <ChevronRight size={20} />
                        </PaginationButton>
                     </div>
                     
                     <div className="hidden md:block h-8 w-px bg-border" />
                     
                     <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                        Matrix View <span className="text-foreground">{products.length}</span> of <span className="text-foreground">{totalProducts}</span>
                     </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 text-center bg-secondary/10 rounded-[60px] border border-dashed flex flex-col items-center">
                 <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <X size={40} className="text-muted-foreground opacity-30" />
                 </div>
                 <h3 className="text-3xl font-bold tracking-tighter mb-4">No Matrix Found</h3>
                 <p className="text-muted-foreground max-w-xs mx-auto">Try refining your dynamic filters to find what you're looking for.</p>
                 <button onClick={resetFilters} className="mt-8 bg-foreground text-background px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">
                    Clear All Filters
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <Motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 z-100 bg-background lg:hidden p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-4xl font-bold tracking-tighter uppercase">Filter Lab</h2>
               <button onClick={() => setShowMobileFilters(false)} className="p-2"><X size={32}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-12 pb-12">
               {/* Categories Mobile */}
               <FilterGroup title="Categories">
                 <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <Chip key={cat} label={cat} active={filters.category === cat} onClick={() => updateFilter("category", cat)} />
                    ))}
                 </div>
               </FilterGroup>


            </div>

            <button 
              className="w-full bg-primary text-primary-foreground py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Transformations
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// UI Components
const FilterGroup = ({ title, children }) => (
  <div>
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-foreground/50">{title}</h4>
    {children}
  </div>
);

const Chip = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
      active ? 'bg-foreground text-background border-foreground shadow-lg' : 'hover:bg-secondary text-muted-foreground border-transparent'
    }`}
  >
    {label}
  </button>
);

const BrandOption = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-between group py-1"
  >
    <span className={`text-sm font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
      {label}
    </span>
    <div className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${active ? 'bg-primary border-primary' : 'border-border'}`}>
      {active && <Check size={12} className="text-white" />}
    </div>
  </button>
);




const RatingButton = ({ val, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
      active ? 'bg-primary/10 border-primary text-primary shadow-inner' : 'border-border text-muted-foreground hover:bg-secondary'
    }`}
  >
    <span className="text-xs font-black">{val}+</span>
    <span className="text-[8px] font-bold uppercase opacity-50">Stars</span>
  </button>
);

const PaginationButton = ({ children, onClick, disabled }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:bg-secondary transition-all disabled:opacity-20 disabled:hover:bg-transparent"
  >
    {children}
  </button>
);

export default ProductListing;