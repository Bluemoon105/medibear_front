"use client";

import { useState } from "react";
import SleepChart from "../../components/Sleep/SleepChart";
import SleepInsights from "../../components/Sleep/SleepInsights";
import FormModal from "../../components/Sleep/FormModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SleepPredict() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ToastContainer />   {/* 🔥 여기에 두면 무조건 잘 뜬다 */}

      <div className="flex h-screen bg-[#FFFDF8] text-[#2c2c2c]">
        <div
          className="
            flex-1 flex flex-col 
            px-6 md:px-12 lg:px-16 
            py-10 
            overflow-y-auto
          "
        >
          <h1 className="text-2xl font-bold text-[#B38252] mb-8">
            수면 분석 및 예측
          </h1>

          <SleepChart />

          <button
            onClick={() => setOpen(true)}
            className="
              self-start
              mt-6 mb-6 px-5 py-2 
              rounded-full 
              bg-[#D2B48C] text-black font-semibold
              hover:bg-[#c6a179]
              transition
            "
          >
            활동량 입력
          </button>

          <SleepInsights />
        </div>

        <FormModal isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </>
  );
}