"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Реєстрація
      await authService.register({ username, email, password });

      // 2. Авто-Логін (отримуємо токен відразу)
      const loginData = await authService.login({ email, password });

      // 3. Збереження сесії
      if (loginData.token) {
        localStorage.setItem("token", loginData.token);
        // Зберігаємо інфо про юзера, щоб потім перевіряти стан
        localStorage.setItem("user", JSON.stringify(loginData.user));
      }

      console.log("Реєстрація успішна! Перехід до вибору класу...");
      
      // 4. ПЕРЕНАПРАВЛЕННЯ НА ВИБІР КЛАСУ
      router.push("/class-selection");

    } catch (err: any) {
      console.error("Помилка:", err);
      setError(err.response?.data?.message || "Помилка реєстрації. Спробуйте ще раз."); 
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      <h1 className="text-4xl font-pixel mb-3">Sign Up</h1>
      
      {error && <div className="text-red-500 mb-4 bg-red-900/20 p-2 rounded">{error}</div>}

      <p className="text-sm text-gray-300 mb-6">
        Already have an account?{" "}
        <Link href="/login" className="underline text-blue-400 hover:text-blue-300">
          Log In
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          placeholder="Username"
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
        />
        <Button variant="arrow" type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}