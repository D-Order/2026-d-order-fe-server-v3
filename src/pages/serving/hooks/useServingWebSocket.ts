import { useEffect, useState } from "react";
import { ServingTaskResponse } from "../apis/servingApi";

export const useServingWebSocket = () => {
    const [newTask, setNewTask] = useState<ServingTaskResponse | null>(null);

    useEffect(() => {
        // 1. 기존 http(s) 기반의 VITE_BASE_URL을 ws(s)로 변환
        const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
        const wsUrl = baseUrl.replace(/^http/, "ws").replace(/\/$/, "") + "/ws/serving";
        // 2. 웹소켓 연결 (쿠키가 있다면 브라우저가 자동으로 포함해서 전송함)
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
        console.log("🟢 서빙 웹소켓 연결 성공!");
        };

        socket.onmessage = (event) => {
        try {
            const data: ServingTaskResponse = JSON.parse(event.data);
            console.log("🔔 새 서빙 알림 도착:", data);
            setNewTask(data);
        } catch (error) {
            console.error("웹소켓 데이터 파싱 에러:", error);
        }
        };

        socket.onerror = (error) => {
        console.error("❌ 웹소켓 에러:", error);
        };

        socket.onclose = () => {
        console.log("🔴 서빙 웹소켓 연결 끊김");
        };

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
        socket.close();
        };
    }, []);

    return newTask;
};