import { Link, useLocation } from "react-router-dom";

const item = (active: boolean) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 8,
  background: active ? "#F5F5F5" : "transparent",
  color: "#111",
  textDecoration: "none",
  fontSize: 14,
});

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside
      style={{
        width: "180px",
        minWidth: "180px",
        background: "#FFFFFF",
        borderRight: "1px solid #E5E5E5",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 18px",
      }}
    >
      <div>
        <h3 style={{ margin: "4px 6px 20px", fontWeight: 600, fontSize: 17 }}>
          MediBear
        </h3>
        <Link to="/exercise" style={item(pathname.startsWith("/exercise"))}>
          운동 챗봇
        </Link>
        <Link to="/test" style={item(pathname.startsWith("/test"))}>
          수면 챗봇
        </Link>
        <a style={item(false)}>칼로리 소모량 예측</a>
        <a style={item(false)}>마이페이지</a>
      </div>
      <button
        style={{
          width: "90px",
          padding: "8px 12px",
          borderRadius: 20,
          border: "1px solid #222",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        로그아웃
      </button>
    </aside>
  );
}
