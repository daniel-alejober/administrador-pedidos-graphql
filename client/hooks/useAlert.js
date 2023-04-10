import { useState, useEffect } from "react";

export const useAlert = () => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => {
        closeAlert();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [show]);

  const showAlert = (message, type) => {
    setMessage(message);
    setType(type);
    setShow(true);
  };

  const closeAlert = () => {
    setShow(false);
    setMessage("");
    setType("");
  };

  return { showAlert, show, type, message };
};
