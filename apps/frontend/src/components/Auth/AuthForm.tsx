import React from 'react';
import { Shield } from 'lucide-react';
import AppBranding from '../ui/AppName';

interface AuthFormProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, description, children }) => (
  <div className="h-screen bg-gradient-to-br from-pink-100 to-purple-500 flex flex-col justify-center sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center text-black">
        <AppBranding />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {description}
      </p>
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
        {children}
      </div>
    </div>
  </div>
);

export default AuthForm;
