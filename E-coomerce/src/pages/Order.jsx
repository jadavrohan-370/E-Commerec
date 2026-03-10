import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetRazorpayClientIdQuery,
  useCreateRazorpayOrderMutation,
} from "../store/slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const Order = () => {
  const { id: orderId } = useParams();
  const [sdkReady, setSdkReady] = useState(false);

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const { data: configAuth, isLoading: loadingConfig } =
    useGetRazorpayClientIdQuery();
  const [createRazorpayOrder, { isLoading: loadingRazorpayOrder }] =
    useCreateRazorpayOrderMutation();

  useEffect(() => {
    if (!order) return;

    const addRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order.isPaid) {
      if (!window.Razorpay) {
        addRazorpayScript();
      } else {
        // eslint-disable-next-line
        setSdkReady(true);
      }
    }
  }, [order]);

  const successPaymentHandler = async (paymentResult) => {
    try {
      await payOrder({
        orderId,
        details: {
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_signature: paymentResult.razorpay_signature,
        },
      });
      refetch();
      toast.success("Payment successful");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const displayRazorpay = async () => {
    if (!configAuth) return;

    try {
      const rzpOrderData = await createRazorpayOrder(orderId).unwrap();

      const options = {
        key: configAuth.clientId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: "Croma Clone Inc.",
        description: "Test Transaction",
        image: "https://via.placeholder.com/150",
        order_id: rzpOrderData.id,
        handler: function (response) {
          successPaymentHandler(response);
        },
        prefill: {
          name: order.user.name,
          email: order.user.email,
          contact: "9999999999",
        },
        notes: {
          address: "Croma Clone Corporate Office",
        },
        theme: {
          color: "#14b8a6", // teal-500
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay Load Error:", err);
      toast.error("Failed to initialize payment");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">
        Order ID: {order._id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Shipping Details
            </h2>
            <p className="text-gray-700">
              <strong className="font-semibold">Name: </strong>{" "}
              {order.user.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Email: </strong>{" "}
              <a
                href={`mailto:${order.user.email}`}
                className="text-teal-600 hover:underline"
              >
                {order.user.email}
              </a>
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Address: </strong>
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {order.deliveredAt.substring(0, 10)}
              </Message>
            ) : (
              <Message variant="danger">Status: {order.orderStatus}</Message>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Payment Method
            </h2>
            <p className="text-gray-700 mb-4">
              <strong className="font-semibold">Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">
                Paid on {order.paidAt.substring(0, 10)}
              </Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Order Items
            </h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded bg-gray-50 border"
                    />
                    <Link
                      to={`/product/${item.product._id}`}
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
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 border-b pb-3">
                <span>Tax (15%):</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div>
                {loadingPay && <Loader fullScreen={false} />}
                {!sdkReady || loadingConfig ? (
                  <Loader fullScreen={false} />
                ) : (
                  <button
                    onClick={displayRazorpay}
                    disabled={loadingRazorpayOrder}
                    className="w-full bg-[#3399cc] hover:bg-[#287aa3] text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center shadow-md mb-2"
                  >
                    Pay with Razorpay
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
