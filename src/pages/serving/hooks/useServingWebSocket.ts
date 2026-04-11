import { useEffect, useRef, useState } from "react";
import { ServingTaskResponse } from "../apis/servingApi";

// 🌟 백엔드 WebSocketConfig.java 에 설정된 정확한 경로를 확인하고 맞춰주세요.
// 기존에 /ws/serving 이었다면 그대로 두시면 됩니다.
export function getServingWebSocketUrl(): string {
  const base = import.meta.env.VITE_BASE_URL || "";
  if (!base) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const u = new URL(base);
  const protocol = u.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${u.host}/ws/serving`; 
}

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
  // 콜백 함수를 useRef로 감싸 불필요한 재연결(리렌더링) 방지
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      wsRef.current?.close();
      wsRef.current = null;
      setIsConnected(false);
      return;
    }

    let url: string;
    try {
      url = getServingWebSocketUrl();
    } catch (e) {
      console.error("❌ [ServingWS] URL 생성 에러:", e);
      return;
    }

    console.log(`🚀 [ServingWS] 연결 시도: ${url}`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 [ServingWS] 웹소켓 연결 성공!");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        console.log("📨 [ServingWS] raw message:", event.data);
        const payload = JSON.parse(event.data) as ServingWsPayload;
        console.log(`🔔 [ServingWS] parsed [${payload.type}]:`, payload.data);

        if (payload.type && payload.data) {
          onMessageRef.current(payload.type, payload.data);
        }
      } catch (error) {
        console.error("❌ [ServingWS] 데이터 파싱 에러:", error);
      }
    };

    ws.onerror = (event) => {
      console.error("❌ [ServingWS] 웹소켓 에러 발생:", event);
    };

    ws.onclose = (event) => {
      console.log(`🔴 [ServingWS] 웹소켓 연결 끊김 (code: ${event.code}, reason: ${event.reason || '없음'})`);
      setIsConnected(false);
      if (wsRef.current === ws) wsRef.current = null;
    };

    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [enabled]);

  return { isConnected };
};