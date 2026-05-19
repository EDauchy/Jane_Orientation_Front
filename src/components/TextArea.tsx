import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function TextArea({
  label,
  className,
  ...textareaProps
}: TextAreaProps) {
  return (
    <div>
      <label className="block text-primary mb-1 uppercase">{label}</label>
      <textarea
        {...textareaProps}
        className={`w-full px-3 py-2 border-2 border-gray-300 rounded-xl
          focus:border-primary focus:outline-none transition-colors
          ${className ?? ""}`}
      />
    </div>
  );
}
