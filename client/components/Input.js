import React from "react";

const Input = ({ label, id, type, name, placeholder, formik }) => {
  return (
    <div className="my-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type={type}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-blue-300"
        placeholder={placeholder}
        id={id}
        name={name}
        value={formik.values[`${name}`]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched[`${name}`] && formik.errors[`${name}`] && (
        <div className="my-2 bg-red-200 border-l-4 border-red-500 text-red-700 p-2">
          <p className="font-bold">Error</p>
          <p className="text-sm">{formik.errors[`${name}`]}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
