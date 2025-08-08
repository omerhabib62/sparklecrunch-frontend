"use client";
import { useAuthStore } from "../@stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for persisted store to hydrate
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
        <p className="text-gray-600">
          Hello {user?.firstName || user?.email}, welcome to your dashboard.
        </p>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Projects</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Completed</h3>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">In Progress</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
