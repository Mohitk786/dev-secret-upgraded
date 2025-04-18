import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'success' | 'error' | 'info';

const useToast = () => {
  const showToast = ({ type, message }: { type: ToastType, message: string }) => {
    let toastOptions: ToastOptions = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };

    // Customize styles based on type
    switch (type) {
      case 'success':
        toastOptions = {
          ...toastOptions,
          className: 'bg-green-500 text-white font-bold p-4 rounded-lg shadow-md transform transition-all duration-500 hover:scale-105',
        };
        toast.success(message, toastOptions);
        break;
    
      case 'error':
        toastOptions = {
          ...toastOptions,
          className: 'bg-red-500 text-white font-bold p-4 rounded-lg shadow-md transform transition-all duration-500 hover:scale-105',
        };
        toast.error(message, toastOptions);
        break;
    
      case 'info':
        toastOptions = {
          ...toastOptions,
          className: 'bg-blue-500 text-white font-bold p-4 rounded-lg shadow-md transform transition-all duration-500 hover:scale-105',
        };
        toast.info(message, toastOptions);
        break;
    
      default:
        toastOptions = {
          ...toastOptions,
          className: 'bg-gray-500 text-white font-bold p-4 rounded-lg shadow-md transform transition-all duration-500 hover:scale-105',
        };
        toast(message, toastOptions);
        break;
    }
  };

  return { showToast };
};

export default useToast;
