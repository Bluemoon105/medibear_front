import axios from "../../config/setAxios";

// 일간 리포트 불러오기
export async function getDailyReport(memberNo: number) {
  const res = await axios.get(`/chat/report/daily/${memberNo}`);
  return res.data;
}

// 주간 리포트 불러오기
export async function getWeeklyReport(memberNo: number) {
  const res = await axios.get(`/chat/report/weekly/${memberNo}`);
  return res.data;
}
