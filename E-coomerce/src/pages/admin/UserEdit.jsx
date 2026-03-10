import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../store/slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const UserEdit = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.role === "admin");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId,
        name,
        email,
        role: isAdmin ? "admin" : "user",
      });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Link
        to="/admin/userlist"
        className="flex items-center text-teal-600 hover:underline mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Go Back
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          Edit User
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

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isadmin"
                className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label
                htmlFor="isadmin"
                className="ml-2 block text-gray-900 font-medium cursor-pointer"
              >
                Is Admin
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Update User
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
