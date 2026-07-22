"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const signupSuccess = searchParams.get("signup") === "success";
  console.log("Search Param:", searchParams.get("signup"));

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, "name and value");
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };


  console.log(formData, "formdata rohit....");
  const handleSubmit = async (event) => {
    // event.preventDefault();
      console.log("Button Click");
    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await apiClient.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = data?.token;
      const user = data?.user;

      if (token && user) {
        const authenticatedUser = { ...user, accessToken: token };
        setUser(authenticatedUser);
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
        router.replace("/dashboard");
        return;
      }

      setErrorMessage("Login was successful but no session was returned.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "An error occurred during login."     
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            W
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Workspace</h2>
        </div>

        <h1 className="text-4xl font-bold text-gray-900">Welcome back</h1>

        <p className="text-gray-500 mt-3 mb-8">
          Welcome back - pick up where you left off.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
            
                name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-600"
             
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-black">
              Password
            </label>

            <input
              // type="password"
              name="password"
              // value={formData.password}
              onChange={handleChange}
              className={`w-full h-14 rounded-xl border px-4 outline-none ${
                formData.password.length > 0 && formData.password.length < 6
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          {signupSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Account created successfully. Please sign in.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70 text-white font-semibold transition"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-indigo-600 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
