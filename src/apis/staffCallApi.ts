import { instance } from "@services/instance";

export type StaffCallType = string;

export interface StaffCallItem {
  id: number;
  staff_call_id?: number;
  table_id: number;
  cart_id: number;
  call_type: StaffCallType;
  category?: string;
  table_num?: number;
  table_usage_id?: number;
  cart_price?: number;
  created_at?: string;
  accepted_at?: string | null;
  accepted_by?: string | null;
  completed_at?: string | null;
  waiting_sec?: number;
  /** 예: PENDING, ACCEPTED, COMPLETED */
  status?: string;
}

/** 화면/도메인에서 쓰는 camelCase */
export interface StaffCallAcceptRequest {
  tableId: number;
  cartId: number;
  callType: StaffCallType;
}

/** 화면/도메인에서 쓰는 camelCase */
export interface StaffCallCancelRequest {
  tableId: number;
  cartId: number;
  callType: StaffCallType;
}

export interface StaffCallCompleteRequest {
  tableId: number;
  cartId: number;
  callType: StaffCallType;
}

// CSRF 토큰 주입은 instance.ts의 request 인터셉터가 자동 처리한다.
// host-only 쿠키 전환 후 server.dorder-api.shop JS에서 API 호스트 csrftoken을
// document.cookie로 못 읽기 때문에, 수동 추출이 아닌 인터셉터의 fetchCsrfToken 경로를 써야 한다.

const toWire = (body: {
  tableId: number;
  cartId: number;
  callType: StaffCallType;
}) => ({
  tableId: Number(body.tableId),
  cartId: Number(body.cartId),
  callType: String(body.callType ?? "")
    .trim()
    .toUpperCase(),
});

// POST /api/v3/spring/server/accept
export const staffCallAcceptApi = async (
  body: StaffCallAcceptRequest
): Promise<{ message: string; data?: unknown }> => {
  const res = await instance.post(
    `/api/v3/spring/server/accept`,
    toWire(body)
  );
  return res.data;
};

// POST /api/v3/spring/server/staffcall/complete
export const staffCallCompleteApi = async (
  body: StaffCallCompleteRequest
): Promise<{ message: string; data?: unknown }> => {
  const res = await instance.post(
    `/api/v3/spring/server/staffcall/complete`,
    toWire(body)
  );
  return res.data;
};

// POST /api/v3/spring/server/staffcall/cancel
export const staffCallCancelApi = async (
  body: StaffCallCancelRequest
): Promise<{ message: string; data?: unknown }> => {
  const res = await instance.post(
    `/api/v3/spring/server/staffcall/cancel`,
    toWire(body)
  );
  return res.data;
};
