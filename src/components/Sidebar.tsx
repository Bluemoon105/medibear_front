import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const getActive = (path: string) => pathname.startsWith(path);

  const navItemStyle = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 8,
    background: active ? "#B38252" : "transparent",
    color: "#000",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    transition: "all 0.2s ease",
  });

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
        boxSizing: "border-box",
      }}
    >
      <div>
        <h3
          style={{
            margin: "4px 6px 20px",
            fontWeight: 700,
            fontSize: 17,
            color: "#111",
          }}
        >
          MediBear
        </h3>

        {/* 각 메뉴별 Link */}
        <Link to="/exercise" style={navItemStyle(getActive("/exercise"))}>
          운동 챗봇
        </Link>
        <Link to="/sleepChat" style={navItemStyle(getActive("/sleepChat"))}>
          수면 챗봇
        </Link>
        {/* 새로 추가된 “수면 분석” 메뉴 */}
        <Link to="/sleepPredict" style={navItemStyle(getActive("/sleepPredict"))}>
          수면 분석
        </Link>
        <Link to="/caloriesPredict" style={navItemStyle(getActive("/caloriesPredict"))}>
          칼로리 소모량 예측
        </Link>
        <Link to="/mypage" style={navItemStyle(getActive("/mypage"))}>
          마이페이지
        </Link>
      </div>

      <button
        style={{
          width: "125px",
          height: "40px",
          padding: "8px 12px",
          borderRadius: 20,
          background: "#B38252",
          color: "#000",
          cursor: "pointer",
          fontWeight: 600,
          alignSelf: "center",
          outline:"none",
          border:"none",
        }}
      >
        로그아웃
      </button>
    </aside>
  );
}
