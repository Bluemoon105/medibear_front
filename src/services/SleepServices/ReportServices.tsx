import { getUserEmail } from "../../utils/getUserEmail";
import {autoRefreshCheck} from "../../utils/TokenUtils"

// 일간 리포트 불러오기
export async function getDailyReport(){
  const email = getUserEmail();
  if (!email) throw new Error("JWT에서 이메일을 찾을 수 없습니다.");

  const res = await autoRefreshCheck({
    url: '/chat/report/daily',
    method:"GET",
    params:{email},
    credentials:"include",
  });

  return res.data;
}

// 주간 리포트 불러오기
export async function getWeeklyReport() {
  const email = getUserEmail();
  if (!email) throw new Error("JWT에서 이메일을 찾을 수 없습니다.");

  const res = await autoRefreshCheck({
    url: '/chat/report/weekly',
    method: "GET",
    params: {email},
    credentials: "include",
  });
  
  return res.data;
}