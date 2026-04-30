import { instance } from "@services/instance";

// 🌟 백엔드 명세 변경: catchedBy 필드 완전 삭제됨
export interface ServingTaskResponse {
  taskId: number;
  orderItemId: number;
  /** 일부 WS/조회 응답에 테이블 번호가 포함될 수 있음 */
  tableNumber?: number;
  menuName?: string;
  quantity?: number;
  status: string;
  requestedAt: string;
}

export interface ServingFilterMenuOption {
  id: number;
  name: string;
}

export interface ServingFilterOptionsData {
  menus: ServingFilterMenuOption[];
  tableCount: number;
  tables: number[];
}

export interface ServingFilterOptionsResponse {
  message: string;
  data: ServingFilterOptionsData;
}

// 1. 운영자 서빙 대기 목록 조회 API
export const getServingCalls = async () => {
  const response = await instance.get<ServingTaskResponse[]>(
    `/api/v3/spring/serving/servingcall`
  );
  return response.data;
};

export const getServingFilterOptions = async (): Promise<ServingFilterOptionsResponse> => {
  const response = await instance.get<ServingFilterOptionsResponse>(
    "/api/v3/spring/serving/filter-options"
  );
  return response.data;
};

// 2. 서빙 상태 변경 : 서빙 요청 수락 (SERVE_REQUESTED -> SERVING)
export const servingCatchApi = async (taskId: number) => {
  const response = await instance.post<string>(
    "/api/v3/spring/serving/catchcall",
    null,
    { params: { taskId } }
  );
  return response.data;
};

// 3. 서빙 상태 변경 : 서빙 완료 (SERVING -> SERVED)
export const servingCompleteApi = async (taskId: number) => {
  const response = await instance.post<string>(
    "/api/v3/spring/serving/complete",
    null,
    { params: { taskId } }
  );
  return response.data;
};

// 4. 서빙 상태 변경 : 서빙 요청 수락 취소 (SERVING -> SERVE_REQUESTED)
export const servingCancelApi = async (taskId: number) => {
  const response = await instance.post<string>(
    "/api/v3/spring/serving/cancel",
    null,
    { params: { taskId } }
  );
  return response.data;
};

// 5. 주문 취소 (직원/운영용) : /server/order/cancel
// NOTE: spring 서버에서 staff_call 기준으로 검증(booth_id 일치)하므로 staffCallId(taskId)를 전송
export const serverOrderCancelApi = async (body: { staffCallId: number }) => {
  const response = await instance.post<string>(
    "/api/v3/spring/server/order/cancel",
    { staffCallId: Number(body.staffCallId) }
  );
  return response.data;
};