"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../@services/auth.service";
import { useAuthStore } from "../@stores/auth.store";

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
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken);
      router.push("/dashboard");
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
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full mb-2"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 w-full mb-2"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
