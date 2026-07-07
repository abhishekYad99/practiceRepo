"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Login() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await login(form);

      console.log("Login Response....... :", res);

      // Save user in zustand

      setUser({
        ...res.user,
        accessToken: res.accessToken || res.token,
      });

      router.push("/dashboard");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-3 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          className="mb-4 w-full rounded border p-3 outline-none"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
        >
          {loading ? "Logging..." : "Login"}
        </button>

        <p className="mt-5 text-center">
          Don't have an account?
          <Link href="/signup" className="ml-2 font-semibold text-blue-600">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
