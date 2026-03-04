import { useState } from "react";
import { loginApi, LoginRequest, LoginResponse } from "@apis/authApi";

interface UseLoginResult {
  login: (body: LoginRequest) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: LoginResponse | null;
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoginResponse | null>(null);

  const login = async (body: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(body);

      setData(res);
    } catch (err: any) {
      console.log("Login Error Response:", err.response); // ← 에러 응답 전체 로그
      if (err.response?.data?.message) {
        console.log("Login Error Message:", err.response.data.message); // ← 메시지 로그
        setError(err.response.data.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, data };
}
