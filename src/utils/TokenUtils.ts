import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosPlain from "../config/axiosPlain"; // refresh 전용
import axiosJwt from "../config/axiosJwt";   // Authorization 자동 포함

type RefreshCallback = (newToken: string | null) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshCallback[] = [];

// 대기 중인 요청 모두 재시도
function onRefreshed(newToken: string | null) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: RefreshCallback) {
  refreshSubscribers.push(cb);
}

export async function autoRefreshCheck<T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  try {
	// 1) 원래 요청 수행
	const response = await axiosJwt.request<T>({
	  ...config,
	  withCredentials: true,
	});
	return response;

  } catch (error: any) {
	const status = error?.response?.status;
	const code = error?.response?.data?.code;

	if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
	  console.warn("🔄 AccessToken 만료 → Refresh 진행");

	  return new Promise((resolve, reject) => {
		addRefreshSubscriber(async (newToken) => {
		  if (!newToken) return reject("refresh failed");

		  try {
			const retryResponse = await axiosJwt.request<T>({
			  ...config,
			  withCredentials: true,
			});
			resolve(retryResponse);

		  } catch (retryErr) {
			reject(retryErr);
		  }
		});

		// Refresh 실행 (오직 한 번만)
		if (!isRefreshing) {
		  isRefreshing = true;

		  axiosPlain
			.post("/api/auth/refresh", {}, { withCredentials: true })
			.then((refreshRes) => {
			  const newToken =
				refreshRes.headers["authorization"] ??
				refreshRes.headers["Authorization"];

			  if (!newToken) throw new Error("⚠ 토큰 재발급 실패");

			  // localStorage 저장
			  localStorage.setItem("accessToken", newToken);

			  // axiosAuth 인스턴스에도 적용
			  axiosJwt.defaults.headers.Authorization = newToken;

			  // 대기중인 요청들 다시 실행
			  onRefreshed(newToken);
			})
			.catch((e) => {
			  console.error("Refresh 실패:", e);
			  localStorage.removeItem("accessToken");
			  refreshSubscribers.forEach((cb) => cb(null));
			  reject(e);
			})
			.finally(() => {
			  isRefreshing = false;
			});
		}
	  });
	}

	// 401이지만 토큰 만료가 아님
	throw error;
  }
}
