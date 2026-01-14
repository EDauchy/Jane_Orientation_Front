"use client";

import React from 'react';

// 1. Define the shape of the props
interface StyledTitleProps {
  text: string;
  className?: string; // The '?' makes it optional
}

// 2. Apply the types to the component
const StyledTitle = ({ text, className = "" }: StyledTitleProps) => {
  return (
    <h2 className={`text-4xl px-10 text-center font-extrabold text-[#681bff] uppercase ${className}`}>
      {text}
    </h2>
  );
};

export default StyledTitle;