"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Для перенаправлення після логіну
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
// Імпортуємо твій сервіс (перевір шлях, якщо він відрізняється)
import { authService } from "@/services/authService"; 

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Очищаємо помилки перед новим запитом

    try {
      console.log("Спроба входу...", { email, password });

      // Використовуємо твій сервіс!
      const data = await authService.login({
        email: email,
        password: password,
      });

      console.log("Успішний вхід:", data);
      
      // Тут зазвичай зберігають токен (data.token) у LocalStorage або Cookies
      localStorage.setItem("token", data.token);

      // Перенаправляємо користувача на головну сторінку
      router.push("/"); 

    } catch (err: any) {
      console.error("Помилка входу:", err);
      // Якщо axios повертає помилку, вона часто лежить в err.response.data
      setError("Невірний логін або пароль (або помилка сервера)");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      <h1 className="text-4xl font-pixel mb-3">Log In</h1>
      
      {/* Відображення помилки, якщо вона є */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <p className="text-sm text-gray-300 mb-6">
        New here?{" "}
        <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
          Sign Up
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          placeholder="Email" // Змінили плейсхолдер
          type="email"        // Браузер перевірить, чи це email
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="arrow" type="submit" className="w-full mt-2">
          Next
        </Button>
      </form>
    </div>
  );
}