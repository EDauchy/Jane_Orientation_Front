import React from 'react';

interface SelectInputProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
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
            <label className="block text-primary mb-1 uppercase">
                {label}
            </label>
            <select
                {...selectProps}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded-xl
          focus:border-primary focus:outline-none transition-colors
          ${className ?? ''}`}
            >
                {children}
            </select>
        </div>
    );
}
