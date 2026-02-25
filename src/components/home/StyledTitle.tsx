"use client";


interface StyledTitleProps {
  text: string;
  className?: string;
}

const StyledTitle = ({ text, className = "" }: StyledTitleProps) => {
  return (
    <h2 className={`text-4xl px-10 text-center font-extrabold text-primary uppercase  ${className}`}>
      {text}
    </h2>
  );
};

export default StyledTitle;