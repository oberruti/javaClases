import React from "react";
import { toast } from "react-toastify";

const useRenderToast = () => {
  const renderToast = (type: string, message: string, onClose?: () => void) => {
    if (type === "success") {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose,
      });
    }
    if (type === "error") {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose,
      });
    }
    if (type === "loading") {
      toast(`🌀 ${message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose,
      });
    }
  };
  return renderToast;
};

export default useRenderToast;
