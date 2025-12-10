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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 2. Викликаємо метод register
      await authService.register({
        username,
        email,
        password
      });

      console.log("Реєстрація успішна!");
      
      // 3. Після успішної реєстрації перекидаємо на логін,
      // щоб юзер ввів дані ще раз і отримав токен.
     router.push("/login");

    } catch (err: any) {
      console.error("Помилка реєстрації:", err);
      setError("Помилка реєстрації. Можливо, такий користувач вже існує."); 
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      <h1 className="text-4xl font-pixel mb-3">Sign Up</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}

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
        />
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
          Create Account
        </Button>
      </form>
    </div>
  );
}