import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { autoRefreshCheck } from "../../utils/TokenUtils";
import { getUserEmail } from "../../utils/getUserEmail";

interface SleepRecord {
  date: string;
  sleepHours: number;
  sleepQuality: number;
  fatigue: number;   // ⭐ 피로도 점수(0~100)
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

        const res = await autoRefreshCheck({
          url: "/sleep/recent",
          method: "GET",
          params: { email },
        });

        const formatted: SleepRecord[] = res.data.data
          .map((d: any) => ({
            date: d.date?.slice(5),
            sleepHours: d.sleepHours ?? 0,
            sleepQuality: d.predictedSleepQuality ?? 0,
            fatigue: d.predictedFatigueScore ?? 0, 
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
    <div className="bg-[#FAF3E0] rounded-2xl shadow-md h-[300px] flex items-center justify-center p-8">
      {sleepData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={sleepData}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D4B1" />

            {/* 날짜 X축 */}
            <XAxis dataKey="date" stroke="#B38252" />

            {/* 왼쪽 Y축 (수면시간, 수면질) 0~10 */}
            <YAxis
              yAxisId="left"
              domain={[0, 10]}
              stroke="#B38252"
            />

            {/* 오른쪽 Y축 (피로도) 0~100 */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              stroke="#8B5A2B"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFDF8",
                border: "1px solid #D2B48C",
              }}
              labelStyle={{ color: "#B38252" }}
            />

            {/* 수면시간 (막대) */}
            <Bar
              yAxisId="left"
              dataKey="sleepHours"
              fill="#D2B48C"
              name="수면시간"
              radius={[6, 6, 0, 0]}
            />

            {/* 수면질 (막대) */}
            <Bar
              yAxisId="left"
              dataKey="sleepQuality"
              fill="#B79A74"
              name="수면 질"
              radius={[6, 6, 0, 0]}
            />

            {/* 피로도 (선) */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="fatigue"
              stroke="#B38252"
              strokeWidth={3}
              dot={{ r: 3, fill: "#B38252" }}
              name="피로도"
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <span className="text-[#B38252] text-[16px]">
          수면 데이터가 없습니다
        </span>
      )}
    </div>
  );
}
