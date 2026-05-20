import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  minLength,
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-primary mb-1 uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md 
                   text-primary placeholder-primary
                   focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 ${className}`}
      />
    </div>
  );
};

export default InputField;
