import { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      alert("Please agree to the Privacy Policy.");
      return;
    }
    if (form.password !== form.passwordCheck) {
      alert("Passwords do not match.");
      return;
    }
    console.log("Registration Data:", form);
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
      {/* Logo */}
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
        <p style={{ fontSize: "13px", color: "#444", marginBottom: "10px" }}>
          Enter your information to create an account.
        </p>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={baseInputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
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
              outline: "none",
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
              outline: "none",
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
        <div style={{ width: "100%" }}>
          <label
            style={{
              fontSize: "13px",
              color: "#B38252",
              fontWeight: 500,
              marginBottom: "4px",
              display: "block",
            }}
          >
            Birth Date
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "48px",
                lineHeight: "48px",
                padding: "0 48px 0 16px",
                borderRadius: 10,
                border: "1px solid #D2B48C",
                background: "#FFF",
                fontSize: "14px",
                outline: "none",
                color: "#000",
                boxSizing: "border-box",
                textAlign: "center",
                appearance: "none",
                MozAppearance: "textfield",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#B38252")}
              onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
            />

            <style>
              {`
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-clear-button {
                  display: none;
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                  opacity: 0;
                  pointer-events: auto;
                  position: absolute;
                  right: 0;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
              `}
            </style>

            {/* Custom Calendar Icon */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                opacity: 0.7,
              }}
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                stroke="#B38252"
                strokeWidth="1.5"
              />
              <path
                d="M8 3V7M16 3V7"
                stroke="#B38252"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path d="M3 10H21" stroke="#B38252" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="email@domain.com"
          value={form.email}
          onChange={handleChange}
          style={baseInputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={baseInputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
        />

        {/* Password Check */}
        <input
          type="password"
          name="passwordCheck"
          placeholder="Confirm Password"
          value={form.passwordCheck}
          onChange={handleChange}
          style={baseInputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#B38252")}
          onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
        />

        {/* Privacy Agreement */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#000",
          }}
        >
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            style={{
              width: "16px",
              height: "16px",
              accentColor: "#B38252",
            }}
          />
          <label>I agree to the collection and use of personal information.</label>
        </div>

        {/* Submit Button */}
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
