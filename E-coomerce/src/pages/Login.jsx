import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../store/slices/usersApiSlice";
import { setCredentials } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 relative">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded transition-colors flex justify-center items-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-teal-600 hover:underline font-medium"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
