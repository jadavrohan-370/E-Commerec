import React from "react";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingCart } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <Link
          to="/admin/productlist"
          className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 text-sm">
            Manage inventory, create new products, and edit details.
          </p>
        </Link>
        <Link
          to="/admin/userlist"
          className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Users</h2>
          <p className="text-gray-500 text-sm">
            View user base, manage roles, and delete accounts.
          </p>
        </Link>
        <Link
          to="/admin/orderlist"
          className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center space-y-4 group"
        >
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingCart size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-500 text-sm">
            Track all orders, mark deliveries, and monitor sales.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
