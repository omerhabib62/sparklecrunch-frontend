"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../@services/auth.service";
import { useAuthStore } from "../@stores/auth.store";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", {
        email,
        password: password ? "***" : "EMPTY",
      });
      const response = await login(email, password);
      console.log("🔥 RAW API RESPONSE:", response);

      const { user, accessToken } = response;
      console.log("🔥 USER FROM API:", user);
      console.log("🔥 profileCompleted from API:", user.profileCompleted);

      setAuth(user, accessToken);

      // Wait for cookie to be set, then force full page navigation
      setTimeout(() => {
        console.log("🚀 Forcing navigation to trigger middleware");
        window.location.replace("/"); // Use replace instead of href
      }, 200);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign up here
          </Link>
        </p>
        <p>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
