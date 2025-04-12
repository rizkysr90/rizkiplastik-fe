import { useEffect } from "react";
export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}
export const NotificationToast: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000, // Default duration: 3 seconds
}) => {
  // Automatically close the notification after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Get the appropriate colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-800";
      case "error":
        return "bg-red-100 border-red-500 text-red-800";
      case "info":
      default:
        return "bg-blue-100 border-blue-500 text-blue-800";
    }
  };
  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md border-l-4 shadow-md ${getTypeStyles()}`}
    >
      <div className="flex justify-between items-start">
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-gray-600 hover:text-gray-800"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};
