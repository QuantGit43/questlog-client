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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Спроба входу...", { email, password });

      const data = await authService.login({
        email: email,
        password: password,
      });

      console.log("Успішний вхід:", data);
      
      // Тут зберігаються токен (data.token) у LocalStorage або Cookies
      localStorage.setItem("token", data.token);

      // Перенаправляємо користувача на головну сторінку
      router.push("/dashboard"); 

    } catch (err: any) {
      console.error("Помилка входу:", err);
      setError("Невірний логін або пароль (або помилка сервера)");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      <h1 className="text-4xl font-pixel mb-3">Log In</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}

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