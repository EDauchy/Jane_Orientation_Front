import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextInput({
  label,
  className,
  ...inputProps
}: TextInputProps) {
  return (
    <div>
      <label className="block text-primary mb-1 uppercase">{label}</label>
      <input
        {...inputProps}
        className={`w-full px-3 py-2 border-2 border-gray-300 rounded-xl 
            focus:border-primary focus:outline-none transition-colors`}
      />
    </div>
  );
}
