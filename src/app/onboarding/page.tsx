"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../@stores/auth.store";
import { logout as logoutService } from "../@services/auth.service";
import {
  completeClientOnboarding,
  completeFreelancerOnboarding,
} from "../@services/onboarding.service";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout, updateUser, isHydrated } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isHydrated) {
    return <div className="p-4 max-w-md mx-auto mt-10">Loading...</div>;
  }

  if (!user) {
    // Middleware should handle this, but guard anyway
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
    } catch (e) {
      // ignore backend failure on logout
    } finally {
      logout();
      router.push("/login");
    }
  };

  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = new FormData(e.target as HTMLFormElement);
    const bio = String(form.get("bio") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const skillsRaw = String(form.get("skills") || "");
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!bio || skills.length === 0) {
      setError("Please fill in the required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updated = await completeFreelancerOnboarding({
        bio,
        phone,
        skills,
      });
      updateUser({ ...updated, profileCompleted: true });
      router.push("/dashboard");
    } catch (err) {
      console.error("Freelancer onboarding error:", err);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = new FormData(e.target as HTMLFormElement);
    const phone = String(form.get("phone") || "").trim();
    const companyName = String(form.get("companyName") || "").trim();
    const bio = String(form.get("bio") || "").trim();

    // Adjust required fields per your backend rules
    if (!bio) {
      setError("Please fill in the required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updated = await completeClientOnboarding({
        phone,
        companyName,
        bio,
      });
      updateUser({ ...updated, profileCompleted: true });
      router.push("/dashboard");
    } catch (err) {
      console.error("Client onboarding error:", err);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          Welcome {user.firstName || user.email}! Please complete your profile.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {user.role === "freelancer" ? (
        <form onSubmit={handleFreelancerSubmit}>
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Tell us about yourself..."
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skills <span className="text-red-500">*</span>
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              placeholder="e.g., JavaScript, React, Node.js"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate skills with commas
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleClientSubmit}>
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              placeholder="Describe your needs or company"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter your company name (optional)"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      )}
    </div>
  );
}
