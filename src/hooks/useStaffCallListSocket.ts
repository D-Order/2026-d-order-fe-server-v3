import { useCallback, useEffect, useRef, useState } from "react";

const LIST_PAYLOAD = { type: "LIST" as const, limit: 20, offset: 0 };

/** `VITE_BASE_URL`(https://host) → `wss://host/ws/server/staffcall` */
export function getStaffCallServerWebSocketUrl(): string {
  const base = import.meta.env.VITE_BASE_URL || "";
  if (!base) {
    throw new Error("VITE_BASE_URL is not set");
  }
  const u = new URL(base);
  const protocol = u.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${u.host}/ws/server/staffcall`;
}

export interface StaffCallListWsPayload {
  items: unknown[];
  total?: number;
}

interface UseStaffCallListSocketOptions {
  enabled: boolean;
  onListUpdate: (payload: StaffCallListWsPayload) => void;
  onError?: (message: string) => void;
}

/**
 * 직원 호출 목록: wss://…/ws/server/staffcall
 * - 연결 후 LIST 전송, LIST_RESULT / STAFF_CALL_SNAPSHOT 으로 목록 갱신
 */
export function useStaffCallListSocket(options: UseStaffCallListSocketOptions) {
  const onListUpdateRef = useRef(options.onListUpdate);
  const onErrorRef = useRef(options.onError);
  onListUpdateRef.current = options.onListUpdate;
  onErrorRef.current = options.onError;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sendList = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify(LIST_PAYLOAD));
  }, []);

  const requestList = useCallback(
    (opts?: { silent?: boolean }) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        if (!opts?.silent) {
          onErrorRef.current?.(
            "연결이 준비되지 않았습니다. 잠시 후 다시 시도해 주세요."
          );
        }
        return;
      }
      setIsRefreshing(true);
      sendList();
    },
    [sendList]
  );

  useEffect(() => {
    if (!options.enabled) {
      wsRef.current?.close();
      wsRef.current = null;
      setIsConnected(false);
      return;
    }

    let url: string;
    try {
      url = getStaffCallServerWebSocketUrl();
    } catch (e) {
      onErrorRef.current?.(
        e instanceof Error ? e.message : "WebSocket URL을 만들 수 없습니다."
      );
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setIsRefreshing(true);
      ws.send(JSON.stringify(LIST_PAYLOAD));
    };

    ws.onmessage = (event) => {
      try {
        console.log("[StaffCallWS] raw message:", event.data);
        const msg = JSON.parse(event.data as string) as {
          type?: string;
          data?: unknown;
          total?: number;
          staff_call_id?: unknown;
          status?: unknown;
        };
        console.log("[StaffCallWS] parsed:", msg);

        if (msg.type === "LIST_RESULT" || msg.type === "STAFF_CALL_SNAPSHOT") {
          const data = Array.isArray(msg.data) ? msg.data : [];
          onListUpdateRef.current({
            items: data,
            total: typeof msg.total === "number" ? msg.total : undefined,
          });
          setIsRefreshing(false);
          return;
        }

        // 단건 상태 이벤트(구독 기반): DELETED 등
        if (msg.type === "STAFF_CALL_STATUS") {
          const status = String((msg as any)?.status ?? "")
            .trim()
            .toUpperCase();
          const staffCallId = Number((msg as any)?.staff_call_id);
          console.log("[StaffCallWS] status event:", { staffCallId, status });

          // DELETED는 LIST_RESULT로 반영되도록 즉시 목록 갱신
          if (status === "DELETED") {
            setIsRefreshing(true);
            sendList();
          }
          return;
        }
      } catch {
        onErrorRef.current?.("목록 메시지를 처리하지 못했습니다.");
        setIsRefreshing(false);
      }
    };

    ws.onerror = () => {
      onErrorRef.current?.("직원 호출 연결 오류");
      setIsRefreshing(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (wsRef.current === ws) wsRef.current = null;
    };

    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [options.enabled]);

  return { isConnected, isRefreshing, requestList };
}
