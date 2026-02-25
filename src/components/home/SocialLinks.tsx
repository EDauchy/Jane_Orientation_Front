import React from "react";
import { FaSquareXTwitter, FaLinkedin } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import type { IconType } from "react-icons";
import type { SocialIcon, SocialLinksProps } from "../../shard/types";


const socialIcons: SocialIcon[] = [
  { key: "x", url: "https://twitter.com", Icon: FaSquareXTwitter },
  { key: "instagram", url: "https://instagram.com", Icon: RiInstagramFill },
  { key: "tiktok", url: "https://www.tiktok.com", Icon: AiFillTikTok },
  { key: "linkedin", url: "https://linkedin.com", Icon: FaLinkedin },
];

const SocialLinks: React.FC<SocialLinksProps> = ({ color = "#F8A128" }) => {
  return (
    <div className="flex items-center gap-2">
      {socialIcons.map(({ key, url, Icon }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        >
          <Icon
            size={
              key === "tiktok"
                ? 27
                : key === "instagram"
                ? 26
                : 24 // Par défaut pour LinkedIn et X
            }
            style={{ color }}
          />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;