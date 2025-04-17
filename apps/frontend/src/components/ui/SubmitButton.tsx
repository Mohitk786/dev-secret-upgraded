"use client"

import React from 'react';
import { Loader2, UserPlus } from 'lucide-react';

interface SubmitButtonProps {
  isPending: boolean;
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending, text, onClick }) => (
  <button
    disabled={isPending}
    onClick={onClick}
    type="submit"
    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <UserPlus className="w-5 h-5 mr-2" />}
    {text}
  </button>
);

export default SubmitButton;
