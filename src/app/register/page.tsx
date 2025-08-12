"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../@services/auth.service";
import { useAuthStore } from "../@stores/auth.store";
import api from "../@lib/api";
import Link from "next/link";

interface Role {
  value: string;
  label: string;
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.login);

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    role: "",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Replace with your actual API endpoint for roles metadata
        const response = await api.get("/auth/register/metadata");
        const rolesData = response.data.roles || [];

        setRoles(rolesData);

        // Set default role if available
        if (rolesData.length > 0) {
          setForm((prev) => ({ ...prev, role: rolesData[0].value }));
        }
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        // Fallback to default roles if API fails
        const fallbackRoles = [
          { value: "client", label: "Client" },
          { value: "freelancer", label: "Freelancer" },
        ];
        setRoles(fallbackRoles);
        setForm((prev) => ({ ...prev, role: fallbackRoles[0].value }));
      } finally {
        setIsLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // Helper function to convert camelCase to "Title Case"
  const formatPlaceholder = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    if (
      !form.email.trim() ||
      !form.password.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.role
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { user, accessToken } = await register(form);
      setAuth(user, accessToken);

      // Force full page navigation to trigger middleware
      setTimeout(() => {
        window.location.replace("/");
      }, 200);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="p-4 max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {(
            [
              "firstName",
              "middleName",
              "lastName",
              "email",
              "password",
            ] as (keyof FormData)[]
          ).map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {formatPlaceholder(field)}{" "}
                {field !== "middleName" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                id={field}
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                placeholder={`Enter your ${formatPlaceholder(
                  field
                ).toLowerCase()}`}
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field !== "middleName"}
                disabled={isSubmitting}
              />
            </div>
          ))}

          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={isLoadingRoles || isSubmitting}
              required
            >
              {isLoadingRoles ? (
                <option value="">Loading roles...</option>
              ) : (
                <>
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed rounded-md hover:bg-gray-800 transition-colors"
            disabled={isSubmitting || isLoadingRoles}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
      <div className="mt-6 text-center space-y-2">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Login here
          </Link>
        </p>
        <p>
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Back to Home
          </Link>
        </p>
      </div>
    </>
  );
}
