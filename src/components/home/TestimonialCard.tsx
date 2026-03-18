import React from "react";
import type { TestimonialCardProps } from "../../shard/types";



const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="relative h-[285px] min-w-[330px] transition-all duration-500">
      <div
        className="h-[190px] bg-primary px-8 py-4 rounded-[25px] rounded-br-none transition-all duration-300"
      >
        <p className="text-white text-xl font-bold text-center leading-relaxed mb-2">
          {testimonial.title}
        </p>
        <p className="text-white text-ms leading-relaxed mb-6">
          {testimonial.text}
        </p>
      </div>

      <div className="relative flex w-full h-auto gap-[15px]">
        <div
          className="absolute right-[100px] top-0 w-[25px] h-[25px] 
            bg-[radial-gradient(circle_at_bottom_left,transparent_25px,#681bff_25px)]"
        ></div>

        <div className="flex gap-[15px] w-full h-[100px] pt-[15px]">
          <div className="h-[85px] w-[85px] bg-primary rounded-[25px]"></div>
          <div className="flex-1 bg-primary rounded-[25px]">
            <div className="w-full h-full flex flex-col py-2 px-4">
              <p className="text-base font-bold text-white">
                {testimonial.name}
              </p>
              <span className="text-sm text-white">{testimonial.role}</span>
              <span className="text-sm text-white">12/12/2025</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[15px]">
          <div className="flex-1 w-[100px] bg-primary rounded-b-[25px]"></div>
          <div className="flex h-9 items-center bg-primary justify-center gap-1 p-2 rounded-[15px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill={i <= testimonial.rating ? "white" : "transparent"}
                stroke="white"
                strokeWidth="3"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.778 1.402 8.178L12 18.896l-7.336 3.88 1.402-8.178L.132 9.21l8.2-1.192z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;