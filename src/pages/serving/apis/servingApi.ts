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
    // instance를 사용하므로 baseURL, headers, 토큰 리프레시 로직이 자동 적용됩니다.
    const response = await instance.get<ServingTaskResponse[]>(
        `/api/v3/spring/serving/servingcall/${boothId}`
    );
    return response.data;
};