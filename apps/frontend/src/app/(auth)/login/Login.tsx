"use client";

import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "@/hooks/mutations/authMutaions";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import AuthForm from "@/components/Auth/AuthForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <AuthForm
      title="Welcome back to DevVault"
      description="Your secrets are safe with us 🔐"
    >
      <form
        className="space-y-6 rounded-2xl  p-8 shadow-xl ring-1"
        onSubmit={handleSubmit}
      >
        <InputField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="text-zinc-400" />}
          placeholder="dev@example.com"
          required
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="text-zinc-400" />}
          placeholder="••••••••"
          required
        />

        <SubmitButton
          isPending={isPending}
          text={isPending ? "Signing in..." : "Sign in"}
          onClick={handleSubmit}
        />

        <div className="mt-6 text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-indigo-500 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </AuthForm>
  );
}
