import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [fullName, setFullName] = useState(shippingAddress?.fullName || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ fullName, street, city, postalCode, country }),
    );
    navigate("/payment");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <CheckoutSteps step1 step2 />
      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Shipping Address
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address / Street
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">City</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Postal Code
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors mt-6"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
