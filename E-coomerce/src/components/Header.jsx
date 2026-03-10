import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useLogoutMutation } from "../store/slices/usersApiSlice";
import { logout } from "../store/slices/authSlice";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

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
    }
  };

  const cartItemCount = cartItems.reduce((a, c) => a + c.qty, 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuCategories = [
    {
      name: "Mobiles & Tablets",
      subcategories: ["Smartphones", "Feature Phones", "Tablets", "Accessories"],
    },
    {
      name: "Laptops & Computers",
      subcategories: ["Gaming Laptops", "Business Laptops", "Student Laptops", "Desktop PCs"],
    },
    {
      name: "TVs & Home Entertainment",
      subcategories: ["Smart TV", "4K UHD TV", "OLED TV", "QLED TV", "Soundbars"],
    },
    {
      name: "Audio",
      subcategories: ["Headphones", "Earbuds", "Bluetooth Speakers", "Home Theaters"],
    },
    {
      name: "Cameras",
      subcategories: ["DSLR Cameras", "Mirrorless", "Action Cameras", "Drones"],
    },
    {
      name: "Home Appliances",
      subcategories: ["Air Conditioners", "Washing Machines", "Refrigerators", "Kitchen Appliances"],
    },
    {
      name: "Wearables",
      subcategories: ["Smart Watches", "Fitness Bands", "Wireless Earbuds"],
    },
    {
      name: "Gaming",
      subcategories: ["Gaming Consoles", "Gaming Laptops", "Gaming Accessories", "VR Headsets"],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
            <span className="hidden sm:block text-sm font-medium">Menu</span>
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-glow">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CROMA
            </span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="relative hidden flex-1 max-w-2xl px-8 lg:block">
          <form onSubmit={handleSearch}>
            <div className="group relative">
              <div className="flex w-full items-center rounded-xl border border-primary/20 bg-white px-4 py-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400">search</span>
                <input
                  type="text"
                  placeholder="Search for headphones, laptops, cameras..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-none bg-transparent px-3 py-1 text-sm focus:ring-0 dark:placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="material-symbols-outlined cursor-pointer text-slate-400 hover:text-primary"
                  >
                    cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {/* User Dropdown */}
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {userInfo.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:bg-slate-800 dark:border-slate-700 animate-slide-down">
                  <div className="border-b border-slate-100 p-4 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{userInfo.name}</p>
                    <p className="text-xs text-slate-500">{userInfo.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/10"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    {userInfo.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-primary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/10"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="material-symbols-outlined w-4 h-4 text-primary">dashboard</span>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logoutHandler();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <User className="w-5 h-5" />
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="mt-3 md:hidden container mx-auto px-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 pl-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-800"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </form>
      </div>

      {/* Menu Dropdown */}
      {isMenuOpen && (
        <div ref={menuRef} className="border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 animate-slide-down">
          <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {menuCategories.map((category) => (
                <div key={category.name} className="border-b border-slate-100 pb-4 md:border-b-0 md:pb-0 dark:border-slate-800">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
                    {category.name}
                  </h3>
                  <ul className="space-y-1">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link
                          to={`/products?category=${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}&type=${sub.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                          className="block py-1.5 text-sm text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Quick Links */}
            <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link
                to="/products"
                className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/products?sort=deals"
                className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                to="/products?sort=new"
                className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

