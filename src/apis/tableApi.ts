import { instance } from "@services/instance";

export interface TableResetRequest {
  table_nums: number[];
}

export interface TableResetResponse {
  message: string;
  data?: {
    reset_table_cnt: number;
  };
}

export const resetTableApi = async (
  body: TableResetRequest
): Promise<TableResetResponse> => {
  const res = await instance.post("/api/v3/spring/table/reset", body);
  return res.data;
};
