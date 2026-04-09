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

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const withCsrfHeader = () => {
  const csrfToken = getCookie("csrftoken");
  return {
    headers: {
      ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
    },
  };
};

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
    toWire(body),
    withCsrfHeader()
  );
  return res.data;
};

// POST /api/v3/spring/server/staffcall/complete
export const staffCallCompleteApi = async (
  body: StaffCallCompleteRequest
): Promise<{ message: string; data?: unknown }> => {
  const res = await instance.post(
    `/api/v3/spring/server/staffcall/complete`,
    toWire(body),
    withCsrfHeader()
  );
  return res.data;
};

// POST /api/v3/spring/server/staffcall/cancel
export const staffCallCancelApi = async (
  body: StaffCallCancelRequest
): Promise<{ message: string; data?: unknown }> => {
  const res = await instance.post(
    `/api/v3/spring/server/staffcall/cancel`,
    toWire(body),
    withCsrfHeader()
  );
  return res.data;
};
