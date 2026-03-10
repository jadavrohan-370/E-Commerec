import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../store/slices/ordersApiSlice";
import { clearCartItems } from "../store/slices/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.street) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.shippingAddress.street, cart.paymentMethod, navigate]);

  // Calculate prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% tax
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Shipping</h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Address: </strong>
              {cart.shippingAddress.street}, {cart.shippingAddress.city},{" "}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Payment Method
            </h2>
            <strong className="font-semibold text-gray-700">Method: </strong>
            {cart.paymentMethod}
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Order Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded bg-gray-50 border"
                    />
                    <Link
                      to={`/product/${item._id}`}
                      className="flex-1 hover:text-teal-600 text-gray-800 line-clamp-2 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    <div className="font-medium text-gray-700">
                      {item.qty} x ${item.price.toFixed(2)} = $
                      {(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items:</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b pb-3">
                <span>Tax (15%):</span>
                <span>${taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {error && (
              <Message variant="danger">
                {error?.data?.message || "Error creating order"}
              </Message>
            )}

            <button
              type="button"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center"
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 text-white" fullScreen={false} />
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
