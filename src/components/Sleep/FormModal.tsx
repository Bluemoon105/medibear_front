"use client";
import { useEffect, useRef, useState } from "react";
import axios from "../../config/setAxios";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({ isOpen, onClose }: FormModalProps) {
  const [formData, setFormData] = useState({
    sleepHours: "",
    caffeineMg: "",
    alcoholConsumption: "",
    activityHours: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 배경 클릭 닫기
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // POST + 예측 API + 새로고침
  const handleSubmit = async () => {
    try {
      const payload = {
        userId: "user001",
        sleepHours: parseFloat(formData.sleepHours) || 0,
        caffeineMg: parseFloat(formData.caffeineMg) || 0,
        alcoholConsumption: parseFloat(formData.alcoholConsumption) || 0,
        physicalActivityHours: parseFloat(formData.activityHours) || 0,
      };

      console.log("📤 활동 데이터 전송:", payload);

      // 1️⃣ 활동 데이터 저장
      const res = await axios.post("/sleep/activities", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ 활동 데이터 저장 완료:", res.data);

      // 2️⃣ 피로도 예측 호출
      console.log("📡 피로도 예측 요청...");
      const predict = await axios.post(
        `/sleep/activities/predict-fatigue`,
        null,
        { params: { userId: 1 } }
      );
      console.log("✅ 피로도 예측 결과:", predict.data);

      alert("오늘의 활동 데이터가 저장되고 피로도 예측이 완료되었습니다!");

      // 입력 초기화
      setFormData({
        sleepHours: "",
        caffeineMg: "",
        alcoholConsumption: "",
        activityHours: "",
      });

      onClose();

      // ✅ SleepAnalysis 페이지 전체 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (err: any) {
      console.error("❌ 에러 발생:", err);
      if (err.response?.status === 400) {
        alert(err.response.data || "오늘은 이미 활동량이 등록되었습니다.");
      } else {
        alert("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      onClick={handleOutsideClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        ref={modalRef}
        style={{
          background: "#FAF3E0",
          borderRadius: 20,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          width: "420px",
          padding: "32px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "16px",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#B38252",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 600,
            color: "#B38252",
            marginBottom: "24px",
          }}
        >
          수면 및 활동 데이터 입력
        </h2>

        {/* 입력 필드 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            alignItems: "center",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <InputField label="수면시간 (시간)" name="sleepHours" value={formData.sleepHours} onChange={handleChange} />
          <InputField label="카페인 섭취량 (mg)" name="caffeineMg" value={formData.caffeineMg} onChange={handleChange} />
          <InputField label="알코올 섭취량 (잔)" name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange} />
          <InputField label="활동량 (시간)" name="activityHours" value={formData.activityHours} onChange={handleChange} />
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", gap: "12px", width: "100%" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#ccc",
              color: "#333",
              border: "none",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#D2B48C",
              color: "#000",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// 입력 필드
function InputField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 500,
          color: "#B38252",
          marginBottom: "6px",
          textAlign: "center",
          width: "100%",
        }}
      >
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={name === "caffeineMg" ? "예: 150" : "예: 2.5"}
        style={{
          width: "100%",
          maxWidth: "240px",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #D2B48C",
          outline: "none",
          background: "#FFF",
          fontSize: "14px",
          color: "#333",
          textAlign: "center",
        }}
      />
    </div>
  );
}
