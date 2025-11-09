
# MediBear 운동 챗봇 UI (React TS)

## 실행
```bash
npm install
npm run dev
```
- 브라우저에서 `/exercise` 경로로 이동하세요.

## 기능
- 왼쪽 사이드바 → **운동 챗봇**
- 상단 대화 영역: FastAPI(`/analyze_and_chat`) 결과 출력
- 하단 입력 바:
  - 텍스트만 전송 / 사진 업로드 / 동영상 업로드 / 웹캠 녹화 중 선택
  - 전송 시 Base64로 인코딩되어 FastAPI로 전달됩니다.

## 서버 페이로드
```jsonc
{
  "userId": "user1",
  "message": "질문",
  "image": "<base64-encoded image>",   // 선택적
  "video": "<base64-encoded video>"    // 선택적
}
```
