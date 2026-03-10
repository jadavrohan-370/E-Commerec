import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.street) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate("/placeorder");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <CheckoutSteps step1 step2 step3 />
      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Payment Method
        </h2>
        <form onSubmit={submitHandler}>
          <div className="space-y-4 mb-8">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                className="form-radio h-5 w-5 text-teal-600 focus:ring-teal-500"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="font-medium text-gray-900">
                Razorpay (UPI / Credit Card)
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
