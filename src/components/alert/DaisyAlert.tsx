import React, { useEffect, useState } from "react";
import type { DaisyAlertProps, DaisyAlertPosition } from "../../types/component/alert/DaisyAlert";

interface AlertProps extends DaisyAlertProps {
  onClose: () => void;
  duration?: number;
}

const alertIcons: Record<string, React.ReactNode> = {
  "alert-info": (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01
           M21 12a9 9 0 11-18 0
           9 9 0 0118 0z" />
    </svg>
  ),

  "alert-success": (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M9 12l2 2 4-4
           m6 2a9 9 0 11-18 0
           9 9 0 0118 0z" />
    </svg>
  ),

  "alert-warning": (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 9v2m0 4h.01
           m-6.938 4h13.856c1.54 0 2.502-1.667
           1.732-3L13.732 4c-.77-1.333-2.694-1.333
           -3.464 0L3.34 16c-.77 1.333.192 3
           1.732 3z" />
    </svg>
  ),

  "alert-error": (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 shrink-0 stroke-current"
      fill="none" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M12 9v2m0 4h.01
           M21 12a9 9 0 11-18 0
           9 9 0 0118 0z" />
    </svg>
  ),
};

// ⭐ 위치 스타일 매핑
const positionClasses: Record<DaisyAlertPosition, string> = {
  "top-left": "top-6 left-6",
  "top-center": "top-6 left-1/2 -translate-x-1/2",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-6 right-6",
};

const DaisyAlert = ({
  alertType = "alert-info",
  message,
  onClose,
  position = "top-center", // ⭐ 기본값
  duration = 2500,
}: AlertProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => startFadeOut(), duration);
    return () => clearTimeout(timer);
  }, []);

  const startFadeOut = () => {
    setFadeOut(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <div
      className={`fixed z-50 ${positionClasses[position]}`}
    >
      <div
        role="alert"
        className={`alert ${alertType} shadow-lg relative 
                    w-fit max-w-xs px-5 py-3 
                    flex items-center gap-2 rounded-xl
                    ${fadeOut ? "animate-fade-out" : "animate-fade-in"}`}
      >
        {alertIcons[alertType]}
        <span className="whitespace-nowrap">{message}</span>

        {/* 닫기 버튼 */}
        <button
          className="absolute right-2 top-2 
                    text-base-content/50 hover:text-base-content"
          onClick={startFadeOut}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DaisyAlert;
