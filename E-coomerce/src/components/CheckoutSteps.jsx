import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center mb-8 w-full max-w-3xl mx-auto">
      <div className="flex items-center w-full relative">
        {/* Step 1 */}
        <div className="relative flex flex-col items-center flex-1">
          {step1 ? (
            <Link
              to="/login"
              className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full z-10 transition-colors"
            >
              <Check className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-400 rounded-full z-10">
              1
            </div>
          )}
          <span
            className={`text-xs font-medium mt-2 absolute top-8 ${step1 ? "text-teal-600" : "text-gray-400"}`}
          >
            Login
          </span>
        </div>

        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step2 ? "border-teal-500" : "border-gray-200"}`}
        ></div>

        {/* Step 2 */}
        <div className="relative flex flex-col items-center flex-1">
          {step2 ? (
            <Link
              to="/shipping"
              className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full z-10"
            >
              <Check className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-400 rounded-full z-10">
              2
            </div>
          )}
          <span
            className={`text-xs font-medium mt-2 absolute top-8 ${step2 ? "text-teal-600" : "text-gray-400"}`}
          >
            Shipping
          </span>
        </div>

        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step3 ? "border-teal-500" : "border-gray-200"}`}
        ></div>

        {/* Step 3 */}
        <div className="relative flex flex-col items-center flex-1">
          {step3 ? (
            <Link
              to="/payment"
              className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full z-10"
            >
              <Check className="w-5 h-5" />
            </Link>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-400 rounded-full z-10">
              3
            </div>
          )}
          <span
            className={`text-xs font-medium mt-2 absolute top-8 ${step3 ? "text-teal-600" : "text-gray-400"}`}
          >
            Payment
          </span>
        </div>

        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step4 ? "border-teal-500" : "border-gray-200"}`}
        ></div>

        {/* Step 4 */}
        <div className="relative flex flex-col items-center flex-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full z-10 ${step4 ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-400"}`}
          >
            {step4 ? <Check className="w-5 h-5" /> : 4}
          </div>
          <span
            className={`text-xs font-medium mt-2 absolute top-8 ${step4 ? "text-teal-600" : "text-gray-400"}`}
          >
            Place Order
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
