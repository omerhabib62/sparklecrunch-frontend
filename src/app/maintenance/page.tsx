"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Auto-retry every 10 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
          }/health`
        );
        if (response.ok) {
          // Backend is back online, redirect to home
          router.push("/");
        } else {
          setRetryCount((prev) => prev + 1);
        }
      } catch (error) {
        setRetryCount((prev) => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  const handleManualRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-yellow-600 text-2xl">🔧</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            System Maintenance
          </h1>
          <p className="text-gray-600">
            Our backend services are currently unavailable. We&apos;re working
            to restore service as quickly as possible.
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Auto-checking every 10 seconds...</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Retry attempts: {retryCount}
          </p>
        </div>

        <button
          onClick={handleManualRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again Now
        </button>

        <div className="mt-6 text-xs text-gray-400">
          <p>Status updates: Check back in a few minutes</p>
        </div>
      </div>
    </div>
  );
}
