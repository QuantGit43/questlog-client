"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center">
      {/* Title */}
      <h1 className="text-4xl font-pixel mb-3">Log In</h1>

      {/* Subtext */}
      <p className="text-sm text-gray-300 mb-6">
        New here?{" "}
        <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
          Sign Up
        </Link>
      </p>

      {/* Form */}
      <form className="flex flex-col gap-4 w-full">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
