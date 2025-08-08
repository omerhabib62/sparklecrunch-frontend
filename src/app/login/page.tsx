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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken);
      router.push("/dashboard"); // or /freelancer-dashboard etc.
    } catch (err) {
      alert("Login failed!");
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 w-full mb-2"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">
          Login
        </button>
      </form>
    </div>
  );
}
