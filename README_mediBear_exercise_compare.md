
# Exercise Compare (측면/정면 동시 재생)

## 라우트
- `/exercise` 로 이동

## 전문가 영상 넣기
- `public/expert/` 폴더에 아래 식으로 파일을 넣으세요.
  - `squat_side.mp4`, `squat_front.mp4`, `squat.mp4`
  - `pushup_side.mp4`, `pushup_front.mp4`, `pushup.mp4`
  - 등…

## 동작
1) 사용자 동영상을 업로드하고 질문을 입력 → `전송`
2) 프론트는 동영상을 base64로 인코딩하여 FastAPI `/analyze_and_chat` 에 전송
3) 응답의 `analysis.detected_exercise`(또는 `detected_exercise`)를 보고 전문가 영상 파일을 자동 선택
   - 뷰 선택자에서 **측면/정면/자동** 선택 가능 (기본: 측면)
   - 파일이 없으면 `exercise.mp4` 로 폴백

## 동기화 재생
- 상단 컨트롤로 **동기화 재생** / 속도 조절 / 처음으로 이동 제공
- 두 영상의 재생/일시정지/탐색이 함께 동기화됩니다.
