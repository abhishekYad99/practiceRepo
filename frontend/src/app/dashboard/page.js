"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboard } from "@/services/dashboardService";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  ListTodo,
  Clock3,
  CircleDashed,
  Check,
  CalendarClock,
  FileText,
} from "lucide-react";

const initialDashboard = {
  totalTasks: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  pendingToday: 0,
  totalDocuments: 0,
};

const cards = [
  {
    key: "totalTasks",
    title: "Total Tasks",
    icon: ListTodo,
    leftBorder: "border-l-4 border-l-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock3,
    leftBorder: "border-l-4 border-l-gray-300",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
  {
    key: "inProgress",
    title: "In Progress",
    icon: CircleDashed,
    leftBorder: "border-l-4 border-l-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "completed",
    title: "Completed",
    icon: Check,
    leftBorder: "border-l-4 border-l-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    key: "pendingToday",
    title: "Pending Today",
    icon: CalendarClock,
    leftBorder: "border-l-4 border-l-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    key: "totalDocuments",
    title: "Total Documents",
    icon: FileText,
    leftBorder: "border-l-4 border-l-purple-500",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const token = useAuthStore((state) => state.user?.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      setErrorMessage("");

      const data = await getDashboard();

      console.log(data,"data dashboard rohit")

      setDashboard({
        totalTasks: Number(data?.total ?? 0),
        pending: Number(data?.pending ?? 0),
        inProgress: Number(data?.inProgress ?? 0),
        completed: Number(data?.completed ?? 0),
        pendingToday: Number(data?.pendingToday ?? 0),
        totalDocuments: Number(data?.totalDocuments ?? 0),
      });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchDashboard();
  }, [hasHydrated, token, router]);

  if (!hasHydrated || !token) return null;

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          Loading Dashboard...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.key}
                className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${card.leftBorder} p-6 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-medium text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="mt-8 text-5xl font-bold text-gray-900">
                      {dashboard[card.key]}
                    </h2>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}