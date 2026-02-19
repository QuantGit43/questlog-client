"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });

      if (data.token) {
        login(data.token, data, "/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 401) setError("Невірний email або пароль.");
      else if (status === 404) setError("Користувача не знайдено.");
      else setError(msg || "Сталася помилка. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-pixel mb-3 text-white">Log In</h1>

      {error && (
        <div className="text-red-500 mb-4 bg-red-900/20 p-3 rounded text-sm border border-red-500/50 w-full">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-300 mb-6">
        New here?{" "}
        <Link 
          href="/signup" 
          className="underline text-blue-400 hover:text-blue-300 transition-colors"
        >
          Sign Up
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          variant="arrow" 
          type="submit" 
          className="w-full mt-2" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Enter World"}
        </Button>
      </form>
    </>
  );
}

