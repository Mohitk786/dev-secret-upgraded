"use client"

import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLoginMutation } from '@/hooks/mutations/authMutaions';
import InputField from '@/components/ui/InputField';
import SubmitButton from '@/components/ui/SubmitButton';
import AuthForm from '@/components/Auth/AuthForm';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <AuthForm title="Welcome back to DevVault" description="Your secrets are safe with us 🔐">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail />}
          placeholder="dev@example.com"
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

        <SubmitButton isPending={isPending} text={isPending ? 'Signing in...' : 'Sign in'} onClick={handleSubmit} />

        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
              <Github className="w-5 h-5 mr-2" /> GitHub </button>
          </div>
        </div> */}
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </AuthForm>
  );
}