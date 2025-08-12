"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../@stores/auth.store";
import { logout as logoutService } from "../@services/auth.service";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
        <p className="text-sm">
          Welcome {user?.firstName || user?.email}! Please complete your profile
          to access all features.
        </p>
      </div>

      <form>
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell us about yourself..."
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            placeholder="Enter your location"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {user?.role === "freelancer" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills <span className="text-red-500">*</span>
              </label>
              <input
                id="skills"
                type="text"
                placeholder="e.g., JavaScript, React, Node.js"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate skills with commas
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="hourlyRate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hourly Rate (USD) <span className="text-red-500">*</span>
              </label>
              <input
                id="hourlyRate"
                type="number"
                min="1"
                placeholder="25"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </>
        )}

        {user?.role === "client" && (
          <div className="mb-4">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <input
              id="company"
              type="text"
              placeholder="Enter your company name (optional)"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-800 transition-colors"
        >
          Complete Profile
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Your information is secure and will only be used to improve your
          experience.
        </p>
      </div>
    </div>
  );
}
