import { useEffect, useState } from "react";
import axios from "../../config/setAxios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SleepRecord {
  date: string;
  sleepHours: number;
}

export default function SleepChart() {
  const [sleepData, setSleepData] = useState<SleepRecord[]>([]);
  const memberNo = 2;

  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await axios.get(`/sleep/recent`, { params: { memberNo } });

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
        console.error("❌ 수면 데이터 불러오기 실패:", err);
      }
    };

    fetchSleepData();
  }, []);

  return (
    <div
      style={{
        background: "#FAF3E0",
        borderRadius: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "280px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px 32px",
      }}
    >
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
        <span style={{ color: "#B38252", fontSize: "16px" }}>
          수면 데이터가 없습니다
        </span>
      )}
    </div>
  );
}
