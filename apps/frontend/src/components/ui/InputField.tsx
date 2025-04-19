"use client"

import React from 'react';

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
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        required={required}
        className="appearance-none block text-gray-500 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default InputField;
