"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../@services/auth.service";
import { useAuthStore } from "../@stores/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    role: "client",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { user, accessToken } = await register(form);
      setAuth(user, accessToken);
      router.push("/dashboard");
    } catch (err) {
      alert("Registration failed");
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister}>
        {["firstName", "middleName", "lastName", "email", "password"].map(
          (field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={field}
              className="border p-2 w-full mb-2"
            />
          )
        )}
        <select
          className="w-full mb-2 p-2 border"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">
          Register
        </button>
      </form>
    </div>
  );
}
