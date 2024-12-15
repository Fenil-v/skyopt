import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastAlert = ({
  icon,
  title,
  timer = 2500,
}: {
  icon: "success" | "error";
  title: string;
  timer?: number;
}): Promise<void> => {
  return new Promise((resolve) => {
    const options:any = {
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Bounce,
      onClose: resolve,
    };

    toast.dismiss(); // Clear previous toasts

    if (icon === "success") {
      toast.success(title, options);
    } else if (icon === "error") {
      toast.error(title, options);
    }

    // Use a fallback timeout in case the user doesn't close the toast manually
    setTimeout(resolve, timer);
  });
};

export default ToastAlert;