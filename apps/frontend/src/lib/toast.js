import React from 'react';
import { useToast } from '@/hooks/use-toast';
import moment from 'moment/moment';

const useToastHook = () => {
  const { toast } = useToast();

  const toaster = ({ message, duration = 2000, isError = false }) => {
    toast({
      title: (
        <span
          className={`${isError ? 'text-red-500' : 'text-green-600'} font-semibold`}
        >
          {message || 'Error!!!'}
        </span>
      ),
      description: (
        <div className="text-sm text-gray-500 !mt-0">
          {moment().format('hh:mm A')}
        </div>
      ),
      duration: duration || 2000,
    });
  };

  return {
    success: ({ message, duration }) =>
      toaster({ message, duration, isError: false }),
    error: ({ message, duration }) =>
      toaster({ message, duration, isError: true }),
  };
};

export default useToastHook;
