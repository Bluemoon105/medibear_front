import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "../config/setAxios"; // axios 인스턴스

type RefreshCallback = (newToken: string | null) => void;

let isRefreshing = false;
let refreshSubscribers: RefreshCallback[] = [];

// 토큰 재발급 완료 후 대기 중이던 요청들 재실행
function onRefreshed(newToken: string | null) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// 재발급이 끝날 때까지 요청을 큐에 넣기
function addRefreshSubscriber(callback: RefreshCallback) {
  refreshSubscribers.push(callback);
}

/**
 * accessToken 만료 시 refresh 후 원 요청을 재실행해 반환.
 * - accessToken 이 없으면 `undefined` 를 반환할 수 있음(원래 JS 로직 유지).
 */
export async function autoRefreshCheck<T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T> | undefined> {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // 기존 JS 코드와 동일하게: 토큰이 없으면 아무 것도 하지 않음
    // (원한다면 여기서 그냥 axios(config) 실행하도록 바꿔도 됨)
    return;
  }

  try {
    // 원래 요청 실행
    const response = await axios.request<T>({
      ...config,
      headers: {
        ...(config.headers as Record<string, any>),
        Authorization: token,
      },
      withCredentials: true,
    });
    return response;
  } catch (error: any) {
    const status = error?.response?.status as number | undefined;
    const code = error?.response?.data?.code as string | undefined;

    if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
      alert("refreshToken 재발급중 .....");

      return new Promise<AxiosResponse<T>>((resolve, reject) => {
        // 재발급이 끝나면 큐에 있던 요청 재시도
        addRefreshSubscriber(async (newToken) => {
          try {
            const retryResponse = await axios.request<T>({
              ...config,
              headers: {
                ...(config.headers as Record<string, any>),
                Authorization: newToken ?? "",
              },
              withCredentials: true,
            });
            resolve(retryResponse);
          } catch (retryError) {
            reject(retryError);
          }
        });

        if (!isRefreshing) {
          isRefreshing = true;

          axios
            .post("/api/auth/refresh", {}, { withCredentials: true })
            .then((refreshRes) => {
              const newToken =
                (refreshRes.headers as Record<string, any>)["authorization"] ??
                (refreshRes.headers as Record<string, any>)["Authorization"];

              if (!newToken) throw new Error("토큰 재발급 실패");

              localStorage.setItem("accessToken", newToken);
              onRefreshed(newToken); // 대기 요청 모두 실행
            })
            .catch((refreshError) => {
              localStorage.removeItem("accessToken");
              alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
              // 대기 중이던 요청들에 null 전달(실패 처리)
              refreshSubscribers.forEach((cb) => cb(null));
              refreshSubscribers = [];
              reject(refreshError);
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
      });
    } else {
      console.error(
        "인증 실패 또는 기타 에러:",
        error?.response?.data ?? error?.message
      );
      throw error;
    }
  }
}