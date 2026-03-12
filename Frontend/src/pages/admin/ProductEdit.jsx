import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from "../../store/slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const ProductEdit = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(
        product.images && product.images.length > 0 ? product.images[0] : "",
      );
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();

      toast.success("Product updated");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Link
        to="/admin/productlist"
        className="flex items-center text-teal-600 hover:underline mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Go Back
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Edit Product
        </h1>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Price ($)
              </label>
              <input
                type="number"
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Image URL
              </label>
              <input
                type="text"
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Brand
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Count In Stock
              </label>
              <input
                type="number"
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Category
              </label>
              <input
                type="text"
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Description
              </label>
              <textarea
                required
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
                placeholder="Enter description"
                value={description}
                rows="4"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;
