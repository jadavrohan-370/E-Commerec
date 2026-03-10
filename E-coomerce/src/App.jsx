import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import Profile from "./pages/Profile";

import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OrderList from "./pages/admin/OrderList";
import ProductList from "./pages/admin/ProductList";
import ProductEdit from "./pages/admin/ProductEdit";
import UserList from "./pages/admin/UserList";
import UserEdit from "./pages/admin/UserEdit";

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <Header />

      <main className="grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/category/:category" element={<ProductListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/profile" element={<Profile />} />

          {/* Registered Admin Routes */}
          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orderlist" element={<OrderList />} />
            <Route path="/admin/productlist" element={<ProductList />} />
            <Route
              path="/admin/productlist/:pageNumber?"
              element={<ProductList />}
            />
            <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
            <Route path="/admin/userlist" element={<UserList />} />
            <Route path="/admin/user/:id/edit" element={<UserEdit />} />
          </Route>
        </Routes>
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center p-6 border-t border-slate-800">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
            <p>
              &copy; {new Date().getFullYear()} NexNova Croma Store. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

export default App;
