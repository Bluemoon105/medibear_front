"use client";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { autoRefreshCheck } from "../utils/TokenUtils";
import { Eye, EyeOff } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string; // email
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userId,
}: EditProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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

  const handleSubmit = async () => {
    // 입력값 검증
    if (!formData.password || !formData.newPassword) {
      toast.warn("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.", {
        position: "top-center",
      });
      return;
    }

    // 새 비밀번호 길이 검증
    if (formData.newPassword.length < 8) {
      toast.error("새 비밀번호는 8자 이상이어야 합니다.", {
        position: "top-center",
      });
      return;
    }

    try {
      setIsVerifying(true);

      await autoRefreshCheck({
        url: "/api/user/password",
        method: "PATCH",
        data: {
          email: userId,
          oldPassword: formData.password,
          newPassword: formData.newPassword,
        },
      });

      toast.success("비밀번호가 성공적으로 변경되었습니다.", {
        position: "top-center",
      });

      onClose();
      setTimeout(() => window.location.reload(), 700);
    } catch (err: any) {
      console.error("비밀번호 변경 오류:", err);

      // 서버 메시지 파싱
      let msg = "비밀번호 변경 중 오류가 발생했습니다.";

      if (err.response?.data) {
        const data = err.response.data;

        if (typeof data === "string") msg = data;
        else if (data.error) msg = data.error;
        else if (data.message) msg = data.message;
      }

      toast.error(msg, { position: "top-center" });
    } finally {
      setIsVerifying(false);
    }
  };

  const showDeleteConfirmToast = (onConfirm: () => void) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="text-[15px] mb-3 text-[#333]">정말 탈퇴하시겠어요?</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              className="bg-[#B38252] text-white px-3 py-1.5 rounded-md text-[13px]"
            >
              네, 탈퇴할래요
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 text-[#333] px-3 py-1.5 rounded-md text-[13px]"
            >
              취소
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        style: {
          background: "#FAF3E0",
          border: "1px solid #D2B48C",
          borderRadius: "12px",
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    showDeleteConfirmToast(async () => {
      try {
        await autoRefreshCheck({
          url: "/api/user/delete",
          method: "DELETE",
          data: { email: userId },
        });

        toast.success("회원 탈퇴가 완료되었습니다.", {
          position: "top-center",
        });

        onClose();
        setTimeout(() => (window.location.href = "/"), 1000);
      } catch (err) {
        toast.error("회원 탈퇴 중 오류가 발생했습니다.", {
          position: "top-center",
        });
      }
    });
  };

  return (
    <>
      <ToastContainer />

      <div
        onClick={handleOutsideClick}
        className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]"
      >
        <div
          ref={modalRef}
          className="bg-[#FAF3E0] rounded-2xl shadow-xl w-[420px] p-8 relative flex flex-col items-center"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-[#B38252] text-3xl font-bold"
          >
            ×
          </button>

          <h2 className="text-[20px] font-semibold text-[#B38252] mb-6">
            비밀번호 변경
          </h2>

          <div className="flex flex-col gap-5 w-full max-w-[320px]">
            <ReadOnlyField label="이메일 (아이디)" value={userId} />

            <InputField
              label="현재 비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <InputField
              label="새 비밀번호"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col items-center gap-3 mt-8 w-full">
            <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg">
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isVerifying}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  isVerifying ? "bg-[#D2B48C]/60" : "bg-[#D2B48C] text-black"
                }`}
              >
                {isVerifying ? "변경 중..." : "저장"}
              </button>
            </div>

            <button
              onClick={handleDeleteAccount}
              className="text-[13px] text-red-600 underline mt-2"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------------- InputField (toggle + blur 방지) --------------------- */
function InputField({
  label,
  name,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full text-center">
      <label className="block text-sm font-medium text-[#B38252] mb-1">
        {label}
      </label>

      <div className="relative w-full max-w-[240px] mx-auto">
        <input
          type={showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-3 py-2 pr-10 border border-[#D2B48C] rounded-lg bg-white text-center"
        />

        {isFocused && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // ⭐ input blur 방지
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B38252]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------- ReadOnlyField --------------------- */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full text-center">
      <label className="block text-sm font-medium text-[#B38252] mb-1">
        {label}
      </label>
      <input
        value={value}
        readOnly
        className="w-full max-w-[240px] px-3 py-2 border border-[#D2B48C] rounded-lg bg-gray-100 text-gray-500"
      />
    </div>
  );
}
