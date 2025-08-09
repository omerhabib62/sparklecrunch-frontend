"use client";
import { useAuthStore } from "../@stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout, logout as logoutService } from "../@services/auth.service";

export default function DashboardPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useEffect(() => {
    // Only check authentication after store has hydrated
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call API logout endpoint
      await logoutService();
      // Clear local auth state
      logout();
      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local state even if API call fails
      logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

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
