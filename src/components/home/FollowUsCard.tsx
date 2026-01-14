import React from "react";
import SocialLinks from "./SocialLinks"


const FollowUsCard = () => {


  return (
    <div className="relative w-1/2 max-w-sm mx-auto ">
      <div className="absolute -top-4 left-4 w-8 h-8 z-10">
        <img src="./image-check.png" alt="" />
      </div>

      <div className="w-full rounded-2xl py-6 px-4 bg-white relative pt-12 shadow-[0px_2px_8px_rgba(99,99,99,0.2)]"  >
            <p className="text-md font-extrabold leading-tight text-[#F8A128]">
            Suivez <span className="font-normal">notre</span>{" "}
            <span
                className="px-1 rounded-full border-3 border-[#F8A128] text-[#F8A128] bg-white align-middle leading-none"
            >
                aventure
            </span>{" "}
            <span className="font-normal">et soyez</span>
            <span className="text-orange-500 font-normal">les premiers</span>{" "}
            <span className="font-normal">à tout savoir en</span>
            <span
                className="ml-0.5 px-1 rounded-lg border-3 border-[#F8A128] bg-white inline-block mt-1 text-[#F8A128]"
            >
                exclusivité!
            </span>
            </p>



        {/* Icônes réseaux sociaux */}
        <div className="mt-5 flex space-x-3 sm:space-x-4">
          <SocialLinks color="#F8A128" /> 

        </div>
      </div>
    </div>
  );
};

export default FollowUsCard;
