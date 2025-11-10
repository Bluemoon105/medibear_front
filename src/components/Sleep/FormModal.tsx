"use client";
import { useEffect, useRef, useState } from "react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
}

export default function FormModal({ isOpen, onClose, onSubmit }: FormModalProps) {
  const [formData, setFormData] = useState({
    activityHours: "",
    sleepHours: "",
    caffeineMg: "",
    alcoholConsumption: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  //배경 클릭 닫기
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

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      activityHours: "",
      sleepHours: "",
      caffeineMg: "",
      alcoholConsumption: "",
    });
    onClose();
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
          animation: "fadeIn 0.2s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 내부 콘텐츠 중앙 정렬
        }}
      >
        {/* 닫기 버튼 */}
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

        {/* 제목 */}
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

        {/* 중앙 정렬된 입력 필드 영역 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            alignItems: "center", // 중앙 배치
            width: "100%", // 전체 폭 맞추기
            maxWidth: "320px", // 너무 넓지 않게 제한
          }}
        >
          <InputField
            label="활동량 (시간)"
            name="activityHours"
            value={formData.activityHours}
            onChange={handleChange}
          />
          <InputField
            label="수면시간 (시간)"
            name="sleepHours"
            value={formData.sleepHours}
            onChange={handleChange}
          />
          <InputField
            label="카페인 섭취량 (mg)"
            name="caffeineMg"
            value={formData.caffeineMg}
            onChange={handleChange}
          />
          <InputField
            label="알코올 섭취량 (잔)"
            name="alcoholConsumption"
            value={formData.alcoholConsumption}
            onChange={handleChange}
          />
        </div>

        {/* 버튼 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "32px",
            gap: "12px",
            width: "100%",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#ccc",
              color: "#333",
              border: "none",
              outline: "none",
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
              outline:"none",
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

// ✅ 입력 필드
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
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // 라벨과 인풋 중앙 정렬
      }}
    >
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
          transition: "border-color 0.2s ease",
          textAlign: "center", // ✅ 입력 텍스트도 중앙
        }}
        onFocus={(e) => (e.target.style.borderColor = "#B38252")}
        onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
      />
    </div>
  );
}
