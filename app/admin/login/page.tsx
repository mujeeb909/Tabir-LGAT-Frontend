"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useLoginMutation } from "../../../lib/api";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../features/authSlice";

interface ApiError {
  data?: {
    message?: string;
  };
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(form).unwrap();
      const { user, token } = response.data;

      // Save to Redux
      dispatch(setAuth({ user, token }));

      // Save to Local Storage
      localStorage.setItem("auth", JSON.stringify({ user, token }));

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white p-12 rounded-lg shadow-xl w-[500px]">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {(error as ApiError)?.data?.message || "Invalid credentials"}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
