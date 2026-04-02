import { instance } from "@services/instance";

// 백엔드에서 넘어오는 데이터 타입 정의
export interface ServingTaskResponse {
    taskId: number;
    orderItemId: number;
    status: string;
    catchedBy: string | null;
    requestedAt: string;
}

// 1. 부스별 서빙 대기 목록 조회 API
export const getServingCalls = async (boothId: number) => {
    const response = await instance.get<ServingTaskResponse[]>(
        `/api/v3/spring/serving/servingcall/${boothId}`
    );
    return response.data;
};

// 2. 서빙 상태 변경 : 서빙 요청 수락 (SERVE_REQUESTED -> SERVING)
export const servingCatchApi = async (taskId: number, boothId: number) => {
    // 🌟 명세서 반영: Request Body 없음, Query Parameter만 전송
    const response = await instance.post<string>(
        "/api/v3/spring/serving/catchcall",
        null, 
        { params: { taskId, boothId } }
    );
    return response.data;
};

// 3. 서빙 상태 변경 : 서빙 완료 (SERVING -> SERVED)
export const servingCompleteApi = async (taskId: number, boothId: number) => {
    const response = await instance.post<string>(
        "/api/v3/spring/serving/complete",
        null,
        { params: { taskId, boothId } }
    );
    return response.data;
};

// 4. 서빙 상태 변경 : 서빙 요청 수락 취소 (SERVING -> SERVE_REQUESTED)
export const servingCancelApi = async (taskId: number, boothId: number) => {
    const response = await instance.post<string>(
        "/api/v3/spring/serving/cancel",
        null,
        { params: { taskId, boothId } }
    );
    return response.data;
};