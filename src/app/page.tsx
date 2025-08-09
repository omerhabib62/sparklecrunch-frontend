"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./@stores/auth.store";
import Link from "next/link";

export default function HomePage() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isHydrated && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If authenticated, show redirecting message
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to {process.env.NEXT_PUBLIC_APP_NAME || "SparkleCrunch"}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {process.env.NEXT_PUBLIC_APP_TAGLINE ||
              "Your platform for connecting clients and freelancers"}
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">
              Find the perfect match between clients and freelancers
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-green-600 text-xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Work together on projects with powerful tools
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-purple-600 text-xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Succeed</h3>
            <p className="text-gray-600">
              Achieve your goals with our platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
