import {jwtDecode} from "jwt-decode";

export interface DecodedToken{
    memberNo?: number;
    email?: string;
    name?: string;
    gender?: string;
    birthDate? : string;

    type?:string;
    exp?:number;
    iat?:number;

    [key: string]: any;
}

export function getDecodedToken(): DecodedToken | null {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        const pureToken = token.startsWith("Bearer ")
            ? token.replace("Bearer ", "")
            : token;

        return jwtDecode<DecodedToken>(pureToken);
    } catch (e) {
        console.error("JWT decode error:", e);
        return null;
    }

}

export function getUserEmail(): string | null {
    const decoded = getDecodedToken();
    return decoded?.memberId ?? null;
}