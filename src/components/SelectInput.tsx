import React from "react";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export default function SelectInput({
  label,
  className,
  children,
  ...selectProps
}: SelectInputProps) {
  return (
    <div>
      <label className="block text-primary mb-1 uppercase">{label}</label>
      <select {...selectProps} className={`input-base`}>
        {children}
      </select>
    </div>
  );
}
