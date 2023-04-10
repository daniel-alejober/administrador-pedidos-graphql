import React from "react";

const Alert = ({ msg, type }) => {
  let color;
  if (type === "error") {
    color = "bg-red-800";
  } else if (type === "success") {
    color = "bg-green-800";
  } else if (type === "info") {
    color = "bg-blue-800";
  } else if (type === "warning") {
    color = "bg-yellow-800";
  } else {
    color = "bg-gray-500";
  }

  return (
    <div
      className={`p-4 mb-4 text-sm  rounded-lg ${color} text-white my-2`}
      role="alert"
    >
      <span className="font-medium">Alert! {msg}</span>
    </div>
  );
};

export default Alert;
