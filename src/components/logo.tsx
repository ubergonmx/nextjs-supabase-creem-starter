"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type React from "react";

const LogoDark = (props: React.ComponentProps<"svg">) => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_iii_dark)">
      <g clipPath="url(#clip0_dark)">
        <rect width="48" height="48" rx="12" fill="#22262F"/>
        <rect width="48" height="48" fill="url(#paint0_dark)"/>
        <g filter="url(#filter1_d_dark)">
          <path fillRule="evenodd" clipRule="evenodd" d="M24 39C32.2843 39 39 32.2843 39 24C39 15.7157 32.2843 9 24 9C15.7157 9 9 15.7157 9 24C9 32.2843 15.7157 39 24 39ZM27.75 27C31.4779 27 34.5 23.9779 34.5 20.25C34.5 16.5221 31.4779 13.5 27.75 13.5C24.0221 13.5 21 16.5221 21 20.25C21 23.9779 24.0221 27 27.75 27Z" fill="url(#paint1_dark)"/>
        </g>
      </g>
      <rect x="1" y="1" width="46" height="46" rx="11" stroke="url(#paint2_dark)" strokeWidth="2"/>
    </g>
    <defs>
      <filter id="filter0_iii_dark" x="0" y="-3" width="48" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="-3"/>
        <feGaussianBlur stdDeviation="1.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_dark"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="3"/>
        <feGaussianBlur stdDeviation="1.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_dark" result="effect2_innerShadow_dark"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect3_innerShadow_dark"/>
        <feOffset/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_dark" result="effect3_innerShadow_dark"/>
      </filter>
      <filter id="filter1_d_dark" x="6" y="5.25" width="36" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1.5" operator="erode" in="SourceAlpha" result="effect1_dropShadow_dark"/>
        <feOffset dy="2.25"/>
        <feGaussianBlur stdDeviation="2.25"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_dark"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_dark" result="shape"/>
      </filter>
      <linearGradient id="paint0_dark" x1="24" y1="5.96047e-07" x2="26" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="1" stopColor="white" stopOpacity="0.12"/>
      </linearGradient>
      <linearGradient id="paint1_dark" x1="24" y1="9" x2="24" y2="39" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.8"/>
        <stop offset="1" stopColor="white" stopOpacity="0.5"/>
      </linearGradient>
      <linearGradient id="paint2_dark" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.12"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <clipPath id="clip0_dark">
        <rect width="48" height="48" rx="12" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const LogoLight = (props: React.ComponentProps<"svg">) => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g filter="url(#filter0_iii_light)">
      <g clipPath="url(#clip0_light)">
        <rect width="48" height="48" rx="12" fill="#0A0A0A"/>
        <rect width="48" height="48" fill="url(#paint0_light)"/>
        <g filter="url(#filter1_d_light)">
          <path fillRule="evenodd" clipRule="evenodd" d="M24 39C32.2843 39 39 32.2843 39 24C39 15.7157 32.2843 9 24 9C15.7157 9 9 15.7157 9 24C9 32.2843 15.7157 39 24 39ZM27.75 27C31.4779 27 34.5 23.9779 34.5 20.25C34.5 16.5221 31.4779 13.5 27.75 13.5C24.0221 13.5 21 16.5221 21 20.25C21 23.9779 24.0221 27 27.75 27Z" fill="url(#paint1_light)"/>
        </g>
      </g>
      <rect x="1" y="1" width="46" height="46" rx="11" stroke="url(#paint2_light)" strokeWidth="2"/>
    </g>
    <defs>
      <filter id="filter0_iii_light" x="0" y="-3" width="48" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="-3"/>
        <feGaussianBlur stdDeviation="1.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_light"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="3"/>
        <feGaussianBlur stdDeviation="1.5"/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="effect1_innerShadow_light" result="effect2_innerShadow_light"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect3_innerShadow_light"/>
        <feOffset/>
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="effect2_innerShadow_light" result="effect3_innerShadow_light"/>
      </filter>
      <filter id="filter1_d_light" x="6" y="5.25" width="36" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feMorphology radius="1.5" operator="erode" in="SourceAlpha" result="effect1_dropShadow_light"/>
        <feOffset dy="2.25"/>
        <feGaussianBlur stdDeviation="2.25"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_light"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_light" result="shape"/>
      </filter>
      <linearGradient id="paint0_light" x1="24" y1="5.96047e-07" x2="26" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0"/>
        <stop offset="1" stopColor="white" stopOpacity="0.12"/>
      </linearGradient>
      <linearGradient id="paint1_light" x1="24" y1="9" x2="24" y2="39" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.8"/>
        <stop offset="1" stopColor="white" stopOpacity="0.5"/>
      </linearGradient>
      <linearGradient id="paint2_light" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" stopOpacity="0.12"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </linearGradient>
      <clipPath id="clip0_light">
        <rect width="48" height="48" rx="12" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export function LogoIcon(props: React.ComponentProps<"svg">) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <LogoDark {...props} />;
  return resolvedTheme === "dark" ? <LogoDark {...props} /> : <LogoLight {...props} />;
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoIcon />
      <span className="text-sm font-semibold text-foreground">CreemKit</span>
    </span>
  );
}
