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
  return (
    error?.response?.data?.message ||
    error?.response?.data?.detail ||
    error?.response?.data?.error ||
    error?.message ||
    "유효하지 않은 테이블입니다. 테이블 번호를 다시 확인해주세요."
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
