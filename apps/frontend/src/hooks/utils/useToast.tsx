import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'info';

interface ShowToastProps {
  type: ToastType;
  message: string;
}

const useToast = () => {
  const showToast = ({ type, message }: ShowToastProps) => {
    const baseOptions: ToastOptions = {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    const styleMap: Record<ToastType, string> = {
      success: 'bg-green-500 text-white font-semibold p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300',
      error: 'bg-red-500 text-white font-semibold p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300',
      info: 'bg-blue-500 text-white font-semibold p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-300',
    };

    const className = styleMap[type] || 'bg-gray-500 text-white font-semibold p-4 rounded-lg shadow-lg';

    switch (type) {
      case 'success':
        toast.success(message, { ...baseOptions, className });
        break;
      case 'error':
        toast.error(message, { ...baseOptions, className });
        break;
      case 'info':
        toast.info(message, { ...baseOptions, className });
        break;
      default:
        toast(message, { ...baseOptions, className });
    }
  };

  return { showToast };
};

export default useToast;
