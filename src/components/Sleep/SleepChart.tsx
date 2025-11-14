import { useEffect, useState } from "react";
// import axios from "../../config/setAxios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {autoRefreshCheck} from "../../utils/TokenUtils";
import { getUserEmail } from "../../utils/getUserEmail";

interface SleepRecord {
  date: string;
  sleepHours: number;
}

export default function SleepChart() {
  const [sleepData, setSleepData] = useState<SleepRecord[]>([]);

  useEffect(() => {
    const fetchSleepData = async () => {
      try {

        const email = getUserEmail();
        if (!email) {
          console.error("Email not found in jwt");
          return;
        }
        //토큰 재발급요청용 
        const res = await autoRefreshCheck({
          url: "/sleep/recent",
          method: "GET",
          params: {email},
          credentials: 'include',
        });

        const formatted: SleepRecord[] = res.data.data
          .map((d: any) => ({
            date: d.date?.slice(5),
            sleepHours: d.sleepHours ?? 0,
          }))
          .sort(
            (a: SleepRecord, b: SleepRecord) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

        setSleepData(formatted);
      } catch (err) {
        console.error("수면 데이터 불러오기 실패:", err);
      }
    };

    fetchSleepData();
  }, []);

  return (
    <div className="bg-[#FAF3E0] rounded-2xl shadow-md h-[280px] flex items-center justify-center p-8">
      {sleepData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sleepData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D4B1" />
            <XAxis dataKey="date" stroke="#B38252" />
            <YAxis stroke="#B38252" domain={[0, 10]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFDF8",
                border: "1px solid #D2B48C",
              }}
              labelStyle={{ color: "#B38252" }}
            />
            <Bar dataKey="sleepHours" fill="#D2B48C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <span className="text-[#B38252] text-[16px]">
          수면 데이터가 없습니다
        </span>
      )}
    </div>
  );
}