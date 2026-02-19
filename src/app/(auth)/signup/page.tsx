"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Пароль має бути не менше 6 символів.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Пароль має містити хоча б одну ВЕЛИКУ літеру!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({ username, email, password });
      const data = response.data;

      if (data && data.token) {
        login(data.token, data, "/class-selection");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 409) setError("Користувач з таким логіном або поштою вже існує!");
      else if (status === 400) setError(msg || "Невірні дані.");
      else setError(msg || "Сталася помилка сервера.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-pixel mb-3 text-white">Sign Up</h1>

      {error && (
        <div className="text-red-500 mb-4 bg-red-900/20 p-3 rounded text-sm border border-red-500/50 w-full animate-pulse">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-300 mb-6">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="underline text-blue-400 hover:text-blue-300 transition-colors"
        >
          Log In
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          placeholder="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          minLength={6}
        />
        <Button 
          variant="arrow" 
          type="submit" 
          className="w-full mt-2" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Account"}
        </Button>
      </form>
    </>
  );
}