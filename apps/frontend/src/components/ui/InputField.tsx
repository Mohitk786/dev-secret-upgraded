"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from './button';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  icon: React.ReactNode;
  placeholder: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  icon,
  placeholder,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <Input
        id={id}
        type={type === "password" ? (
          showPassword ? "text" : "password"
        ) : type}
        required={required}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 text-gray-900"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {type === "password" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
        >
          {showPassword ? <Eye className="w-4 h-4 text-gray-500" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
        </Button>
      )}
    </div>
  </div>
);
}

export default InputField;
