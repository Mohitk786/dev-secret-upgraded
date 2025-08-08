'use client';

import React, { useState } from "react";
import { UserPlus, Mail, Lock } from 'lucide-react';
import Link from "next/link";
import { useSignupMutation } from "@/hooks/mutations/authMutaions";
import { generateRSAKeyPair } from "@/E2E/rsaKeyGen";
import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import AuthForm from "@/components/Auth/AuthForm";
import useToast from "@/hooks/utils/useToast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const { mutate: signup, isPending } = useSignupMutation();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast({
        type: "error",
        message: "Passwords did not match",
      });
      return;
    }
    const pubKeyBase64 = await generateRSAKeyPair();
    signup({ email, password, publicKey: pubKeyBase64, name });
  };

  return (
    <AuthForm
      title="Create your KeyVault account"
      description="Secure your dev secrets in one powerful vault 🚀"
    >
      <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
        <InputField
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserPlus className="text-zinc-400" />}
          placeholder="John Doe"
          required
        />
        <InputField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="text-zinc-400" />}
          placeholder="you@domain.com"
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
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="text-zinc-400" />}
          placeholder="••••••••"
          required
        />
        <SubmitButton
          isPending={isPending}
          text={isPending ? "Creating account..." : "Create Account"}
          onClick={handleSubmit}
        />
      </form>
      <div className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:underline transition-colors">
          Sign in
        </Link>
      </div>
    </AuthForm>
  );
};

export default Register;
