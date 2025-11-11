import axios from "../../config/setAxios";

// 일간 리포트 불러오기
export async function getDailyReport(userId: string) {
  const res = await axios.get(`/chat/report/daily/${userId}`);
  return res.data;
}

// 주간 리포트 불러오기
export async function getWeeklyReport(userId: string) {
  const res = await axios.get(`/chat/report/weekly/${userId}`);
  return res.data;
}
