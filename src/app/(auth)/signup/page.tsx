"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      {/* TITLE */}
      <h1 className="text-4xl font-pixel text-center mb-3">Sign Up</h1>

      {/* SUBTEXT */}
      <p className="text-sm text-center mb-6 opacity-80">
        Already a member?{" "}
        <Link
          href="/login"
          className="underline hover:opacity-100 transition"
        >
          Log In
        </Link>
      </p>

      {/* FORM */}
      <form className="flex flex-col gap-4 w-full">
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
          Next
        </Button>
      </form>
    </div>
  );
}
