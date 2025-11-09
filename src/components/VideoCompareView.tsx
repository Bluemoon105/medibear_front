
import { useEffect, useRef, useState } from 'react';

interface Props {
  userVideo: string | null;
  expertVideo: string | null;
}

export default function VideoCompareView({ userVideo, expertVideo }: Props) {
  const userRef = useRef<HTMLVideoElement | null>(null);
  const expertRef = useRef<HTMLVideoElement | null>(null);
  const [linked, setLinked] = useState(true);
  const [rate, setRate] = useState(1);

  // keep playbackRate in sync
  useEffect(() => {
    if (userRef.current) userRef.current.playbackRate = rate;
    if (expertRef.current) expertRef.current.playbackRate = rate;
  }, [rate, userVideo, expertVideo]);

  // when currentTime changes on user, seek expert too (if linked)
  const onUserTimeUpdate = () => {
    if (!linked) return;
    if (!userRef.current || !expertRef.current) return;
    const u = userRef.current.currentTime;
    const e = expertRef.current.currentTime;
    if (Math.abs(u - e) > 0.05) {
      expertRef.current.currentTime = u;
    }
  };

  const onExpertTimeUpdate = () => {
    if (!linked) return;
    if (!userRef.current || !expertRef.current) return;
    const u = userRef.current.currentTime;
    const e = expertRef.current.currentTime;
    if (Math.abs(u - e) > 0.05) {
      userRef.current.currentTime = e;
    }
  };

  const playBoth = async () => {
    try {
      await userRef.current?.play();
      await expertRef.current?.play();
    } catch {}
  };
  const pauseBoth = () => { userRef.current?.pause(); expertRef.current?.pause(); };
  const resetBoth = () => { 
    if (userRef.current) userRef.current.currentTime = 0; 
    if (expertRef.current) expertRef.current.currentTime = 0; 
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
        <button onClick={playBoth}>▶ 재생</button>
        <button onClick={pauseBoth}>⏸ 일시정지</button>
        <button onClick={resetBoth}>⏮ 처음으로</button>
        <label style={{marginLeft:8}}>
          <input type="checkbox" checked={linked} onChange={(e)=>setLinked(e.target.checked)} />
          동기화 재생
        </label>
        <label style={{marginLeft:8}}>
          속도:
          <select value={rate} onChange={(e)=>setRate(Number(e.target.value))} style={{marginLeft:6}}>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1.0x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p><b>사용자 영상</b></p>
          {userVideo ? (
            <video ref={userRef} src={userVideo} onTimeUpdate={onUserTimeUpdate} controls width="100%" />
          ) : <p>영상 업로드 전</p>}
        </div>
        <div style={{ flex: 1 }}>
          <p><b>전문가 시범</b></p>
          {expertVideo ? (
            <video ref={expertRef} src={expertVideo} onTimeUpdate={onExpertTimeUpdate} controls width="100%" />
          ) : <p>예시 영상 준비 중</p>}
        </div>
      </div>
    </div>
  );
}
