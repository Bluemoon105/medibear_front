import axios from "../config/setAxios";

let isRefreshing = false;
let refreshSubscribers = [];

// 토큰 재발급 완료 후 대기 중이던 요청들 재실행
function onRefreshed(newToken) {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
}

// 재발급이 끝날 때까지 요청을 큐에 넣기
function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

export async function autoRefreshCheck(config) {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return ;
    }

    try {
        // 원래 요청 실행
        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: token,
            },
            withCredentials: true,
        });
        return response;

    } catch (error) {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (status === 401 && code === "EXPIRED_ACCESS_TOKEN") {
            alert("refreshToen 재발급중 .....");
            return new Promise((resolve, reject) => {
                addRefreshSubscriber(async (newToken) => {
                    try {
                        const retryResponse = await axios({
                            ...config,
                            headers: {
                                ...config.headers,
                                Authorization: newToken,
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

                    axios.post("/api/auth/refresh", {}, {
                        withCredentials: true,
                    })
                        .then((refreshRes) => {
                            const newToken = refreshRes.headers["authorization"];
                            if (!newToken) throw new Error("토큰 재발급 실패");

                            localStorage.setItem("accessToken", newToken);
                            onRefreshed(newToken); // 대기 요청 모두 실행
                        })
                        .catch((refreshError) => {
                            localStorage.removeItem("accessToken");
                            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
                            refreshSubscribers.forEach(callback => callback(null));
                            refreshSubscribers = [];
                            reject(refreshError);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            });

        } else {
            console.error(" 인증 실패 또는 기타 에러:", error.response?.data || error.message);
            throw error;
        }
    }
}
