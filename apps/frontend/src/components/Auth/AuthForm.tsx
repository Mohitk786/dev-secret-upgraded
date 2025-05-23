import React, { Suspense } from "react";
import AppBranding from "../ui/AppName";

interface AuthFormProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  description,
  children,
}) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    }
  >
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-600 px-4">
      <div className="w-full max-w-md space-y-6 ">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AppBranding />
          </div>
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-gray-200">{description}</p>
          )}
        </div>

        <div className="rounded-2xl shadow-2xl px-6 py-8 bg-zinc-900">
          {children}
        </div>
      </div>
    </div>
  </Suspense>
);

export default AuthForm;
