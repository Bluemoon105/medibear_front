import { getUserEmail } from "../../utils/getUserEmail";
import { autoRefreshCheck } from "../../utils/TokenUtils";

// 공통 요청 함수 (중복 제거 + undefined 방어)
async function safeRequest(config: any) {
  const res = await autoRefreshCheck(config);

  if (!res) {
    throw new Error("서버 응답이 없습니다. (토큰 문제 또는 네트워크 오류)");
  }

  return res.data;
}

// 🔥 일간 리포트
export async function getDailyReport() {
  const email = getUserEmail();
  if (!email) throw new Error("JWT에서 이메일을 찾을 수 없습니다.");

  return await safeRequest({
    url: "/chat/report/daily",
    method: "GET",
    params: { email },
  });
}

// 🔥 주간 리포트
export async function getWeeklyReport() {
  const email = getUserEmail();
  if (!email) throw new Error("JWT에서 이메일을 찾을 수 없습니다.");

  return await safeRequest({
    url: "/chat/report/weekly",
    method: "GET",
    params: { email },
  });
}
