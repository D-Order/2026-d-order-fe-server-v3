import { instance } from "@services/instance"; // 경로에 맞게 수정해 주세요.

// 1. 응답 데이터(data 객체 내부) 타입 정의
export interface BoothMyPageData {
    name: string;
    table_max_cnt: number; // 🌟 우리가 필요한 핵심 데이터
    bank: string;
    account: string | number; // 명세서는 int지만 예시는 string이므로 유연하게
    depositor: string;
    seat_type: "PT" | "PP" | "NO" | string;
    seat_fee_person: number;
    seat_fee_table: number;
    table_limit_hours: string | number;
}

// 2. 전체 API 응답 타입 정의
export interface GetBoothMyPageResponse {
    message: string;
    data: BoothMyPageData;
}

// 3. 테이블 개수만 가져오는 API 호출 함수
export const getTableNum = async (): Promise<number> => {
    try {
        const response = await instance.get<GetBoothMyPageResponse>(
        "/api/v3/django/booth/mypage/"
        );
        
        // 다른 데이터는 무시하고 테이블 개수(table_max_cnt)만 바로 반환합니다.
        return response.data.data.table_max_cnt;
        
    } catch (error) {
        console.error("테이블 개수 조회 실패:", error);
        throw error;
    }
};