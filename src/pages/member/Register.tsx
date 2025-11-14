import { useState } from "react";
import axios from "../../config/setAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    gender: "male",
    birth: "",
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 약관 동의 체크
    if (!form.agree) {
      toast.warning("개인정보 수집에 동의해주세요.");
      return;
    }

    // 비밀번호 확인
    if (form.password !== form.passwordCheck) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 요청 데이터
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      gender: form.gender === "male" ? "M" : "F",
      birthDate: form.birth,
    };

    try {
      await axios.post("/api/signUp", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("회원가입이 완료되었습니다!", {
        onClose: () => {
          window.location.href = "/login"; // 완료 후 로그인 페이지 이동
        },
      });
    } catch (err: any) {
      console.error("회원가입 오류:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "회원가입 중 오류가 발생했습니다.";

      toast.error(message);
    }
  };

  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid #D2B48C",
    background: "#FFF",
    fontSize: "14px",
    outline: "none",
    color: "#000",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#FFFDF8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontFamily: "sans-serif",
      }}
    >
      {/* ToastContainer 전역 위치 */}
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>
        MediBear
      </h1>

      {/* Register Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FAF3E0",
          borderRadius: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "40px 48px",
          width: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#B38252" }}>
          Sign Up
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Gender */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, gender: "male" }))}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #D2B48C",
              background: form.gender === "male" ? "#D2B48C" : "#FFF",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, gender: "female" }))}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #D2B48C",
              background: form.gender === "female" ? "#D2B48C" : "#FFF",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Female
          </button>
        </div>

        {/* Birthdate */}
        <input
          type="date"
          name="birth"
          value={form.birth}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="email@domain.com"
          value={form.email}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={baseInputStyle}
        />

        <input
          type="password"
          name="passwordCheck"
          placeholder="Confirm Password"
          value={form.passwordCheck}
          onChange={handleChange}
          style={baseInputStyle}
        />

        {/* Agree */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
          }}
        >
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{ width: "16px", height: "16px", accentColor: "#B38252" }}
          />
          <label>I agree to the collection and use of personal information.</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "999px",
            background: "#D2B48C",
            color: "#000",
            fontWeight: 600,
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            marginTop: "8px",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
