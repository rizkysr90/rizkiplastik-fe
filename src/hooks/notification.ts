import { useState } from "react";
import { NotificationType } from "../components/Notification";

interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType;
}

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (message: string, type: NotificationType) => void;
  hideNotification: () => void;
}

const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({
      show: true,
      message,
      type,
    });
  };
  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };
  return {
    notification,
    showNotification,
    hideNotification,
  };
};

export default useNotification;
