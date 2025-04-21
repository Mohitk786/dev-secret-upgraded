"use client";

import React, { useState } from "react";
import { UserPlus, Mail, Lock } from "lucide-react";
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
        message: "Passwords did  not match",
      });
      return;
    }

    const pubKeyBase64 = await generateRSAKeyPair();

    signup({ email, password, publicKey: pubKeyBase64, name });
  };

  return (
    <AuthForm
      title="Create your KeyVault account"
      description="Start securing your development secrets today 🚀"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserPlus />}
          placeholder="John Doe"
          required
        />
        <InputField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail />}
          placeholder="you@domain.com"
          required
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock />}
          placeholder="••••••••"
          required
        />

        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock />}
          placeholder="••••••••"
          required
        />

        <SubmitButton
          isPending={isPending}
          text={isPending ? "Signing up..." : "Create account"}
          onClick={handleSubmit}
        />

        {/* <div className="mt-8 space-y-4">
          <div className="relative text-center text-muted-foreground text-sm">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="bg-background px-3 relative z-10">or continue with</span>
          </div>

          <button
            type="button"
            className="w-full flex justify-center items-center py-2 px-4 border border-border bg-card text-foreground rounded-xl shadow-sm hover:bg-secondary/30 transition-colors"
          >
            <Github className="w-5 h-5 mr-2" />
            Sign up with GitHub
          </button>
        </div> */}
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthForm>
  );
};

export default Register;
