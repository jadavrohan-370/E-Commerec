import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <Link
        to={`/product/${product._id}`}
        className="block relative pt-[100%] overflow-hidden bg-gray-50"
      >
        <img
          src={
            product.image ||
            product.images?.[0] ||
            "https://via.placeholder.com/300"
          }
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          alt={product.name}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">
          {product.brand}
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-800 font-medium line-clamp-2 hover:text-teal-600 transition-colors h-10 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="mb-3">
          <Rating value={product.rating} text={`(${product.numReviews})`} />
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="text-xl font-bold text-gray-900 border-t border-transparent pt-2">
            ${product.price.toFixed(2)}
          </div>
          {product.countInStock === 0 && (
            <span className="text-xs text-red-500 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
