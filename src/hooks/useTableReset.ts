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
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "알 수 없는 오류가 발생했습니다.";
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
