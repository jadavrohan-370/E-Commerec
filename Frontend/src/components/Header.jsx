import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
  LayoutDashboard,
} from "lucide-react";
import { useLogoutMutation } from "../store/slices/usersApiSlice";
import { logout } from "../store/slices/authSlice";
import { motion as Motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const cartItemCount = cartItems.reduce((a, c) => a + c.qty, 0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevLocation, setPrevLocation] = useState(location.pathname);

  // Close menus on route change during render
  if (location.pathname !== prevLocation) {
    setPrevLocation(location.pathname);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }

  // Check if we are on a page where the header should be transparent (e.g., Home page with Hero)
  const isTransparentPage = location.pathname === "/";

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/90 backdrop-blur-xl border-b py-3 shadow-sm" 
          : isTransparentPage 
            ? "bg-transparent py-6" 
            : "bg-background py-3 border-b"
      }`}
    >
      {/* Subtle top gradient shadow for readability on transparent states */}
      {!isScrolled && isTransparentPage && (
        <div className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent -z-10 h-32 pointer-events-none" />
      )}

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Mobile Menu Toggle */}
            <button 
              className={`lg:hidden p-2 -ml-2 transition-colors ${!isScrolled && isTransparentPage ? 'text-white' : 'text-foreground'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group relative">
              <span className={`text-2xl font-bold tracking-tighter uppercase transition-colors ${!isScrolled && isTransparentPage ? 'text-white drop-shadow-md' : 'text-foreground'}`}>
                Nova<span className={!isScrolled && isTransparentPage ? 'text-white/70' : 'text-primary'}>Store</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              <NavLink to="/products" label="Shop All" isTransparent={!isScrolled && isTransparentPage} />
              <NavLink to="/categories" label="Categories" isTransparent={!isScrolled && isTransparentPage} />
              <NavLink to="/deals" label="Deals" isTransparent={!isScrolled && isTransparentPage} />
              <NavLink to="/new" label="What's New" isTransparent={!isScrolled && isTransparentPage} />
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-5">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden xl:flex relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-48 bg-secondary/50 border-none rounded-full px-5 py-2.5 pl-12 text-sm focus:ring-1 focus:ring-primary/20 transition-all group-hover:bg-secondary/80 focus:w-64 ${!isScrolled && isTransparentPage ? 'bg-white/10 text-white placeholder:text-white/50 backdrop-blur-sm' : ''}`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isScrolled && isTransparentPage ? 'text-white/50' : 'text-muted-foreground'}`} size={16} />
            </form>

            <Link to="/wishlist" className={`p-2.5 rounded-full transition-all relative flex hover:scale-110 active:scale-95 ${!isScrolled && isTransparentPage ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-secondary'}`}>
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-background scale-110">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className={`p-2.5 rounded-full transition-all relative flex hover:scale-110 active:scale-95 ${!isScrolled && isTransparentPage ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-secondary'}`}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-background scale-110">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2.5 p-1.5 pl-3 rounded-full border transition-all hover:shadow-md active:scale-[0.98] ${!isScrolled && isTransparentPage ? 'border-white/20 hover:bg-white/10 text-white' : 'border-border hover:bg-secondary text-foreground'}`}
                >
                  <span className="hidden md:block text-xs font-bold uppercase tracking-wider">{userInfo.name.split(' ')[0]}</span>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black shadow-lg">
                    {userInfo.name.charAt(0)}
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <Motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-background border rounded-3xl shadow-2xl overflow-hidden z-60"
                    >
                      <div className="p-5 border-b bg-secondary/20">
                        <p className="text-sm font-bold tracking-tight">{userInfo.name}</p>
                        <p className="text-xs text-muted-foreground truncate font-medium">{userInfo.email}</p>
                      </div>
                      <div className="p-3">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors">
                          <User size={18} className="text-primary" /> Profile Settings
                        </Link>
                        {userInfo.role === "admin" && (
                          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-secondary transition-colors">
                            <LayoutDashboard size={18} className="text-primary" /> Admin Terminal
                          </Link>
                        )}
                        <div className="h-px bg-border my-2 mx-2" />
                        <button 
                          onClick={logoutHandler}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl hover:bg-destructive/5 text-destructive transition-colors text-left"
                        >
                          <LogOut size={18} /> Disconnect Account
                        </button>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={`p-2.5 rounded-full transition-all flex hover:scale-110 active:scale-95 ${!isScrolled && isTransparentPage ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-secondary'}`}>
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div 
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-100 lg:hidden flex flex-col pt-24"
          >
            <div className="px-8 space-y-12">
              <button 
                className="absolute top-6 left-6 p-2 text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={32} />
              </button>

              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary/50 border-none rounded-2xl px-6 py-4 pl-14 text-lg font-medium focus:ring-2 focus:ring-primary/20"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={24} />
              </form>

              <div className="flex flex-col space-y-6">
                <MobileNavLink to="/products" label="The Collection" count="120+" />
                <MobileNavLink to="/categories" label="Explore Categories" />
                <MobileNavLink to="/deals" label="Limited Opportunities" />
                <MobileNavLink to="/new" label="Fresh Arrivals" />
              </div>

              <div className="pt-12 border-t flex flex-col space-y-6">
                <Link to="/profile" className="flex items-center gap-5 text-xl font-bold tracking-tight py-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <User size={24} />
                  </div>
                  Personal Dashboard
                </Link>
                <Link to="/cart" className="flex items-center gap-5 text-xl font-bold tracking-tight py-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <ShoppingCart size={24} />
                  </div>
                  Shopping Bag ({cartItemCount})
                </Link>
              </div>
            </div>
            
            <div className="mt-auto p-8 bg-secondary/10 flex items-center justify-between">
               <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">NovaStore System Ver. 4.0</span>
               <LogOut size={20} className="text-muted-foreground opacity-30" />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLink = ({ to, label, isTransparent }) => (
  <Link 
    to={to} 
    className={`text-xs font-bold uppercase tracking-[0.2em] transition-all relative group py-2 ${
      isTransparent ? 'text-white' : 'text-foreground'
    }`}
  >
    {label}
    <span className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-500 group-hover:w-full ${
      isTransparent ? 'bg-white' : 'bg-primary'
    }`} />
  </Link>
);

const MobileNavLink = ({ to, label, count }) => (
  <Link to={to} className="flex items-center justify-between group">
    <span className="text-4xl md:text-5xl font-bold tracking-tighter group-active:text-primary transition-colors">{label}</span>
    {count && <span className="text-xs font-black bg-primary text-primary-foreground px-3 py-1 rounded-full">{count}</span>}
  </Link>
);

export default Header;