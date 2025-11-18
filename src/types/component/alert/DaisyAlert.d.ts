// alert 위치
export type DaisyAlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
	| "bottom-center"
	| "bottom-right";

// 경고 타입, 메시지 타입 정의
export interface DaisyAlertProps {
	alertType?: "alert-info" | "alert-success" | "alert-warning" | "alert-error";
	position?: DaisyAlertPosition;
	message: string;
}




