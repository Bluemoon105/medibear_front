import type { ReactNode } from "react";
import { Dumbbell, LogIn, ScrollText, Flame, Moon, BarChart3, ClipboardList, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {autoRefreshCheck} from "../../utils/TokenUtils";
import logo from "../../assets/mainlogo.png";
interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const navigate = useNavigate();
  const LogoImg = logo;
  // 🔥 로그아웃 함수 (axios 요청 + 토큰 삭제 + 화면 이동)
  const handleLogout = async () => {
    try {
      
      await autoRefreshCheck({
        url: "/api/logout",
        method: "POST"
      })

      // 🔥 로컬에서 토큰 삭제
      localStorage.removeItem("accessToken");

    } catch (err) {
      console.error("로그아웃 요청 실패:", err);
    } finally {
      // 메인 화면으로 이동
      navigate("/")
    }
  };

  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content overflow-y-auto h-screen">{children}</div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-100 flex flex-col items-start min-h-full">
          {/* ===== Sidebar Menu ===== */}
          <ul className="menu w-full grow">
            <li>
              <div className="flex items-center justify-center py-3">
                  {/* Drawer 닫힘: 작은 로고 */}
                  <img
                    src={LogoImg}
                    alt="logo"
                    className="inline-block w-6 h-6 my-1.5 is-drawer-open:hidden"
                  />

                  {/* Drawer 열림: 큰 로고 */}
                  <img
                    src={LogoImg}
                    alt="logo"
                    className="w-24 h-auto my-1.5 is-drawer-close:hidden"
                  />
                </div>
            </li>

            {/* 수면 챗봇 */}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="수면챗"
                onClick={() => navigate("/sleep")}
              >
                <Moon
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                <span className="is-drawer-close:hidden">수면</span>
              </button>
            </li>

            {/* 수면 분석 */}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="수면 분석 및 예측"
                onClick={() => navigate("/SleepPredict")}
              >
                <BarChart3
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                <span className="is-drawer-close:hidden">수면 분석</span>
              </button>
            </li>

            {/* 칼로리 소모 */}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="칼로리 소모"
                onClick={() => navigate("/calorie")}
              >
                <Flame
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                <span className="is-drawer-close:hidden">칼로리</span>
              </button>
            </li>
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="스트레스 관리"
                onClick={() => navigate("/stress")}
              >
                <ClipboardList
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                <span className="is-drawer-close:hidden">스트레스 관리</span>
              </button>
            </li>
          </ul>

          {/* ===== 하단 메뉴 ===== */}
          <ul className="menu w-full mt-auto px-2 pb-4">
            <li>
              <button
                type="button"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="마이로그"
                onClick={() => navigate("/mypage")}
              >
                <ScrollText
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                
                <span className="is-drawer-close:hidden">마이로그</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="설정"
                
              >
                <Settings className="inline-block size-4 my-1.5" strokeWidth={2}/>  
                <span className="is-drawer-close:hidden">설정</span>
              </button>
              
            </li>

            <li>
              <button
                type="button"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="로그아웃"
                onClick={handleLogout}
              >
                <LogIn
                  className="inline-block size-4 my-1.5"
                  strokeWidth={2}
                />
                <span className="is-drawer-close:hidden">로그아웃</span>
              </button>
            </li>
          </ul>

          {/* ===== Drawer Toggle Button ===== */}
          <div
            className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Open"
          >
            <label
              htmlFor="my-drawer-4"
              className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="inline-block size-4 my-1.5"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
