import { useState } from "react";
import {
  resetTableApi,
  TableResetRequest,
  TableResetResponse,
} from "@apis/tableApi";

// 반환 타입 정의 수정
interface UseTableResetResult {
  resetTable: (
    body: TableResetRequest
  ) => Promise<{ success: boolean; payload?: TableResetResponse; errorMsg?: string }>;
  loading: boolean;
  error: string | null;
  data: TableResetResponse | null;
}

const getTableResetErrorMessage = (error: any) => {
  if (error?.response?.status === 400) {
    return "초기화할 수 없는 테이블입니다";
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.response?.data?.error ||
    error?.message ||
    "에러가 발생했습니다."
  );
};

export function useTableReset(): UseTableResetResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TableResetResponse | null>(null);

  const resetTable = async (body: TableResetRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await resetTableApi(body);
      setData(res);
      // 성공 시 결과 반환
      return { success: true, payload: res };
    } catch (err: any) {
      const errMsg = getTableResetErrorMessage(err);
      setError(errMsg);
      setData(null);
      // 에러 시 에러 메시지 반환
      return { success: false, errorMsg: errMsg };
    } finally {
      setLoading(false);
    }
  };

  return { resetTable, loading, error, data };
}
