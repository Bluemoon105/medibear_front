// import { useState } from "react";

// export default function CaloriesPredict() {
//   const [exercise, setExercise] = useState("운동 선택");
//   const [time, setTime] = useState(30);
//   const [heartRate, setHeartRate] = useState("");
//   const [result, setResult] = useState("");

//   const handlePredict = () => {
//     // 실제 예측 API 연결 시 이 부분에서 POST
//     const calories = (time * 6.5).toFixed(1); // 예시 계산식
//     setResult(`예상 칼로리 소모량은 약 ${calories} kcal 입니다.`);
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         height: "100vh",
//         backgroundColor: "#FFFDF8",
//         color: "#2c2c2c",
//       }}
//     >
//       {/* 🧭 왼쪽 사이드바 */}
//       <div
//         style={{
//           width: "180px",
//           minWidth: "180px",
//           borderRight: "1px solid #E5E5E5",
//           background: "#FFFFFF",
//         }}
//       >
//         <Sidebar />
//       </div>

//       {/* 📊 메인 영역 */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           padding: "40px 64px",
//           overflowY: "auto",
//         }}
//       >
//         {/* 제목 */}
//         <h1
//           style={{
//             fontSize: "24px",
//             fontWeight: 700,
//             color: "#B38252",
//             marginBottom: "32px",
//           }}
//         >
//           칼로리 소모량 예측
//         </h1>

//         {/* 입력 영역 */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "24px",
//             width: "480px",
//           }}
//         >
//           {/* 운동 종류 선택 */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//             <label
//               style={{
//                 fontSize: "14px",
//                 fontWeight: 500,
//                 color: "#B38252",
//               }}
//             >
//               운동 종류
//             </label>
//             <select
//               value={exercise}
//               onChange={(e) => setExercise(e.target.value)}
//               style={{
//                 width: "100%",
//                 padding: "12px",
//                 borderRadius: 12,
//                 background: "#FAF3E0",
//                 border: "1px solid #D2B48C",
//                 color: "#2c2c2c",
//                 fontSize: "14px",
//                 outline: "none",
//               }}
//             >
//               <option>운동 선택</option>
//               <option>조깅</option>
//               <option>수영</option>
//               <option>요가</option>
//               <option>자전거</option>
//               <option>근력운동</option>
//             </select>
//           </div>

//           {/* 운동 시간 */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//             <label
//               style={{
//                 fontSize: "14px",
//                 fontWeight: 500,
//                 color: "#B38252",
//               }}
//             >
//               운동 시간 (분)
//             </label>
//             <input
//               type="range"
//               min="10"
//               max="120"
//               value={time}
//               onChange={(e) => setTime(Number(e.target.value))}
//               style={{
//                 width: "100%",
//                 accentColor: "#B38252",
//               }}
//             />
//             <p style={{ fontSize: "13px", color: "#555" }}>{time}분</p>
//           </div>

//           {/* 심박수 입력 */}
//           <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//             <label
//               style={{
//                 fontSize: "14px",
//                 fontWeight: 500,
//                 color: "#B38252",
//               }}
//             >
//               심박수 입력 (bpm)
//             </label>
//             <input
//               type="number"
//               value={heartRate}
//               onChange={(e) => setHeartRate(e.target.value)}
//               placeholder="예: 110"
//               style={{
//                 padding: "10px",
//                 borderRadius: 10,
//                 border: "1px solid #D2B48C",
//                 background: "#FFF",
//                 fontSize: "14px",
//                 color: "#000",
//                 outline: "none",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = "#B38252")}
//               onBlur={(e) => (e.target.style.borderColor = "#D2B48C")}
//             />
//           </div>

//           {/* 버튼 영역 */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: "12px",
//               marginTop: "8px",
//             }}
//           >
//             <button
//               onClick={handlePredict}
//               style={{
//                 padding: "10px 18px",
//                 borderRadius: "999px",
//                 background: "#D2B48C",
//                 color: "#000",
//                 fontSize: "14px",
//                 fontWeight: 600,
//                 border: "none",
//                 outline: "none",
//                 cursor: "pointer",
//                 transition: "all 0.2s ease",
//               }}
//             >
//               칼로리 예측
//             </button>
//           </div>
//         </div>

//         {/* 결과 박스 */}
//         <div
//           style={{
//             background: "#FAF3E0",
//             borderRadius: "20px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//             height: "220px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginTop: "40px",
//           }}
//         >
//           <span
//             style={{
//               color: "#B38252",
//               fontSize: "18px",
//               fontWeight: 500,
//               textAlign: "center",
//             }}
//           >
//             {result || "칼로리 소모 예측 및 조언 프롬프트"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
