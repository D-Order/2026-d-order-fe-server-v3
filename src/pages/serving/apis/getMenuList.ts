import { instance } from "@services/instance";

// 1. 단일 메뉴 아이템에 대한 타입 정의
export interface MenuItem {
    id: number | string; // FEE는 숫자형(1001), 일반 메뉴는 문자열("1") 혼용
    name: string;
    price: number;
    category: "FEE" | "MENU" | "DRINK" | "SET" | string; // 명세서 기준 카테고리
    description?: string; // FEE의 경우 (인원 수) 등 부가 설명이 들어옴
    image: string | null; // FEE는 null로 들어올 수 있음
    stock: number; // FEE는 항상 9999
    is_soldout: boolean;
    is_fixed: boolean; // FEE 카테고리 삭제 방지용
}

// 2. 전체 API 응답에 대한 타입 정의
export interface GetMenuListResponse {
    message: string;
    booth_id: number;
    data: MenuItem[];
}

// 3. API 호출 함수
export const getMenuList = async (): Promise<GetMenuListResponse> => {
    try {
        const response = await instance.get<GetMenuListResponse>(
        "/api/v3/django/booth/menu-list/"
        );
        return response.data;
    } catch (error) {
        // instance의 interceptor에서 401(토큰 만료) 등은 기본적으로 처리하지만,
        // 컴포넌트 단에서 403, 404, 500 에러를 캐치해서 UI에 반영할 수 있도록 에러를 던져줍니다.
        console.error("메뉴 목록 조회 실패:", error);
        throw error;
    }
};