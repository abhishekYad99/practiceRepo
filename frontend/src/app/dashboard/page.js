"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboard } from "@/services/dashboardService";
import { useAuthStore } from "@/stores/useAuthStore";

const initialDashboard = {
  totalTasks: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  pendingToday: 0,
  totalDocuments: 0,
};

const cards = [
  { key: "totalTasks", title: "Total Tasks", color: "bg-blue-100 text-blue-600" },
  { key: "pending", title: "Pending", color: "bg-yellow-100 text-yellow-600" },
  { key: "inProgress", title: "In Progress", color: "bg-purple-100 text-purple-600" },
  { key: "completed", title: "Completed", color: "bg-green-100 text-green-600" },
  { key: "pendingToday", title: "Pending Today", color: "bg-red-100 text-red-600" },
  { key: "totalDocuments", title: "Total Documents", color: "bg-gray-100 text-gray-600" },
];

export default function Dashboard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.user?.accessToken);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      setErrorMessage("");
      const data = await getDashboard();
      setDashboard({
        totalTasks: Number(data?.totalTasks ?? 0),
        pending: Number(data?.pending ?? 0),
        inProgress: Number(data?.inProgress ?? 0),
        completed: Number(data?.completed ?? 0),
        pendingToday: Number(data?.pendingToday ?? 0),
        totalDocuments: Number(data?.totalDocuments ?? 0),
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    fetchDashboard();
  }, [router, token]);

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading dashboard data...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div key={card.key} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className={`inline-flex rounded-lg p-3 ${card.color}`}>
                <span className="text-sm font-semibold">{card.title}</span>
              </div>
              <p className="mt-4 text-4xl font-bold text-gray-900">
                {dashboard[card.key]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}