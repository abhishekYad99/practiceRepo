"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await signup(form);
      console.log(res);

      console.log("Signup Response:", res);

      alert("Account created successfully.");

      router.push("/");
    } catch (error) {
      console.log("Signup Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      alert(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">Signup</h1>

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="mb-4 w-full rounded border p-3"
          placeholder="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 text-white"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-5 text-center">
          Already have an account?
          <Link href="/" className="ml-2 text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
