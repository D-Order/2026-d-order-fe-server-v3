import { useEffect } from "react";
import { ServingTaskResponse } from "../apis/servingApi";

// 명세서에 정의된 웹소켓 페이로드 타입
export interface ServingWsPayload {
    type: "NEW_CALL" | "CATCH_CALL" | "COMPLETE_CALL" | "CANCEL_CALL";
    data: ServingTaskResponse;
    }

interface UseServingWebSocketProps {
    enabled?: boolean;
    onMessage: (type: ServingWsPayload["type"], data: ServingTaskResponse) => void;
}

export const useServingWebSocket = ({
    enabled = true,
    onMessage,
    }: UseServingWebSocketProps) => {
    useEffect(() => {
        if (!enabled) return;

        // 1. 기존 http(s) 기반의 VITE_BASE_URL을 ws(s)로 변환
        const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
        const wsUrl = baseUrl.replace(/^http/, "ws").replace(/\/$/, "") + "/ws/serving";
        
        // 2. 웹소켓 연결 (쿠키가 있다면 브라우저가 자동으로 포함해서 전송)
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
        console.log("🟢 서빙 웹소켓 연결 성공!");
        };

        socket.onmessage = (event) => {
        try {
            const payload: ServingWsPayload = JSON.parse(event.data);
            console.log(`🔔 서빙 알림 수신 [${payload.type}]:`, payload.data);
            
            // type과 data가 정상적으로 들어왔는지 확인 후 콜백 실행
            if (payload.type && payload.data) {
            onMessage(payload.type, payload.data);
            }
        } catch (error) {
            console.error("웹소켓 데이터 파싱 에러:", error);
        }
        };

        socket.onerror = (error) => {
        console.error("❌ 서빙 웹소켓 에러:", error);
        };

        socket.onclose = () => {
        console.log("🔴 서빙 웹소켓 연결 끊김");
        };

        // 컴포넌트 언마운트 또는 의존성 변경 시 연결 해제
        return () => {
        socket.close();
        };
    }, [enabled, onMessage]); // 의존성 배열에 onMessage 포함
};