import { notification } from "antd";

const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, config) => {
    api[type]({
      placement: "topRight",
      duration: 3,
      ...config,
    });
  };

  return { contextHolder, openNotificationWithIcon };
};

export default useNotification;
