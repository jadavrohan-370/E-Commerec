import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductDetailsQuery } from "../store/slices/productsApiSlice";
import { addToCart } from "../store/slices/cartSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck } from "lucide-react";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <Link
        to="/"
        className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="flex justify-center items-center bg-gray-50 rounded-xl p-8 object-contain">
            <img
              src={
                product.image ||
                product.images?.[0] ||
                "https://via.placeholder.com/600"
              }
              alt={product.name}
              className="max-w-full h-auto rounded hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 text-sm font-bold tracking-widest text-teal-600 uppercase">
              {product.brand}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-6">
              <Rating
                value={product.rating}
                text={`${product.numReviews} Reviews`}
              />
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-teal-500 mr-3" />1 Year
                Brand Warranty
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="w-5 h-5 text-teal-500 mr-3" />
                Free Delivery within 2-4 business days
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mt-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <span className="text-gray-600">Price</span>
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
                  <span className="text-gray-600">Quantity</span>
                  <select
                    className="form-select w-24 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex justify-center items-center transition-all ${
                  product.countInStock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl"
                }`}
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
