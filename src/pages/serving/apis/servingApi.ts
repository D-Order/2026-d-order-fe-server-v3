import { instance } from "@services/instance";

// 🌟 백엔드 명세 변경: catchedBy 필드 완전 삭제됨
export interface ServingTaskResponse {
    taskId: number;
    orderItemId: number;
    status: string;
    requestedAt: string;
}

// 1. 운영자 서빙 대기 목록 조회 API
export const getServingCalls = async () => {
    const response = await instance.get<ServingTaskResponse[]>(
        `/api/v3/spring/serving/servingcall`
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