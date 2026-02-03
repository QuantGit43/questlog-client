"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService"; 

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Логін
      const data = await authService.login({ email, password });

      // 2. Збереження токена
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      console.log("Вхід успішний:", data.user);

      // 3. РОЗУМНИЙ РОУТИНГ
      // Перевіряємо поле hasAvatar (або classId), яке має повернути бекенд
      if (data.user.hasAvatar) {
          router.push("/dashboard"); 
      } else {
          // Якщо юзер зареєструвався, але закрив вкладку до вибору класу
          router.push("/class-selection");
      }

    } catch (err: any) {
      console.error("Помилка входу:", err);
      setError(err.response?.data?.message || "Невірний логін або пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      <h1 className="text-4xl font-pixel mb-3">Log In</h1>
      
      {error && <div className="text-red-500 mb-4 bg-red-900/20 p-2 rounded">{error}</div>}

      <p className="text-sm text-gray-300 mb-6">
        New here?{" "}
        <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
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
        <Button variant="arrow" type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? "Loading..." : "Enter World"}
        </Button>
      </form>
    </div>
  );
}