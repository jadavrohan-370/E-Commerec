import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Package, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useProfileMutation } from "../store/slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../store/slices/ordersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const {
    data: orders,
    isLoading: loadingOrders,
    error: errorOrders,
  } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      // eslint-disable-next-line
      setName(userInfo.name);
      // eslint-disable-next-line
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Profile Form */}
      <div className="lg:col-span-1 border border-gray-200 p-6 rounded-lg bg-white shadow-sm h-fit">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
          <User className="w-8 h-8 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Full Name
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
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Update Password
            </label>
            <input
              type="password"
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loadingUpdateProfile}
            className="w-full mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 px-4 rounded transition-colors flex justify-center items-center"
          >
            {loadingUpdateProfile ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="lg:col-span-3 border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b">
          <Package className="w-8 h-8 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        </div>

        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant="danger">
            {errorOrders?.data?.message || errorOrders.error}
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order._id.substring(0, 10)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.createdAt.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isPaid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 inline" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.isDelivered ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 inline" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 inline" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-gray-100 hover:bg-teal-500 hover:text-white text-gray-700 py-1.5 px-3 rounded transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                You have no orders yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
