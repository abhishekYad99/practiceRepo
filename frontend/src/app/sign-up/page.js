"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SignUpPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
    if (passwordError) setPasswordError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setErrorMessage("");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    setPasswordError("");

    try {
      const { data } = await apiClient.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = data?.token;
      const user = data?.user;

      if (token && user) {
        router.replace("/login?signup=success");
        return;
      }

      setErrorMessage("Signup was successful but no session was returned.");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to create your account right now.",
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

        <h1 className="text-4xl font-bold text-gray-900">Create account</h1>

        <p className="text-gray-500 mt-3 mb-8">
          Set up your workspace in a few seconds.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full h-14 rounded-xl border px-4 outline-none focus:border-indigo-600 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {passwordError && (
              <p className="mt-2 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
