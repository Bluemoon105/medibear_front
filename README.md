# 🐻 MediBear Frontend

## 팀원 구성
| 이름 | 역할 | Github |
|------|------|---------|
| 🧭 김정규 | FullStack | [@gyu0918](https://github.com/gyu0918) |
| 🌟 유신안 | FullStack | [@shinanyu](https://github.com/shinanyu) |
| 🏗️ 변상용 | FullStack | [@Hayden721](https://github.com/Hayden721) |
| 💫 이승권 | FullStack | [@seoungkwon](https://github.com/seoungkwon) |
| 🎯 임예지 | FullStack | [@Bluemoon105](https://github.com/Bluemoon105) |

## 프로젝트 소개

- 헬스케어와 멘탈케어를 통합한 AI 코팅 웹서비스 구현
- 사용자 개인 맞춤 리포트 및 히스토리 시각화 대시보드 제공
- 프로젝트 기간: 2025.11.03 ~ 2025.11.28

## 기술 스택

### 프론트엔드
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)

### 협업 툴
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

## 팀원별 구현 기능 상세

### 김정규

### 유신안

### 변상용

### 이상권

### 임예지

### 1. 수면 입력 UI(FormModal) 연동
- 사용자가 입력한 sleepHours, caffeineMg, activityLevel 등을 Spring Boot로 전달
- 입력 필드 구조 및 API 요청 스펙 협의·정의
- 사용자 입력 값 검증 및 안내 메시지 적용

### 2. 일간/주간 수면 리포트 UI 구현
- Spring Boot API 호출로 얻은 리포트 데이터를 UI로 표시
- 일간/주간 버튼 기반 조회 기능
- 코칭 메시지, 수면 분석 결과 등 표시 컴포넌트 설계

### 3. 수면 LLM 분석 결과 표시
- FastAPI → Spring Boot → React로 전달된 분석 결과를 UI에 표시
- 수면 챗봇/리포트 UI에서 사용하기 위한 메시지 구조 설계 협업
- JSON 응답 형태에 맞춘 출력 컴포넌트 구성

### 4. 공통 UX 개선
- 자동 스크롤, 로딩 상태, 에러 안내 등 기본 UX 적용
- MediBear 색상 테마 기반 디자인 적용
