import { useState, useEffect, useCallback } from "react";
import components from "../index";
import StaffServeList from "./StaffServeList";
import { getMenuList, MenuItem } from "../../apis/getMenuList";
import { getServingCalls, ServingTaskResponse } from "../../apis/servingApi";
import { useServingWebSocket, ServingWsPayload } from "../../hooks/useServingWebSocket";

// UI 컴포넌트(StaffServeList)가 요구하는 데이터 타입
export interface StaffServeUIItem {
    id: number;
    tableNumber: string;
    request: string;
    waitingTime: number;
    active: boolean;
}

interface StaffServeProps {
    onUpdateServeCount?: (count: number) => void;
    // 상위(ServingPage)로 수락 이벤트를 올리기 위한 함수
    onAcceptServe?: (taskId: number, tableNumber: string) => void;
}

const StaffServe = ({ onUpdateServeCount, onAcceptServe }: StaffServeProps) => {
    const boothId = 1; // TODO: 실제 전역 상태나 Context에서 가져오도록 수정 필요

    const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
    const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

    const [selectedMenuIds, setSelectedMenuIds] = useState<(number | string)[]>([]);
    const [selectedTableRanges, setSelectedTableRanges] = useState<{ start: string; end: string }[]>([]);

    const [menuList, setMenuList] = useState<MenuItem[]>([]);

    // 🌟 실제 서버 데이터를 담을 State
    const [staffServeList, setStaffServeList] = useState<StaffServeUIItem[]>([]);

    // 🌟 상단 탭 뱃지 카운트 업데이트
    useEffect(() => {
        if (onUpdateServeCount) {
        onUpdateServeCount(staffServeList.length);
        }
    }, [staffServeList, onUpdateServeCount]);

    // 백엔드 DTO -> 프론트 UI 모델로 변환하는 헬퍼 함수
    const mapToUIModel = useCallback((task: ServingTaskResponse): StaffServeUIItem => {
        // 요청 시간(requestedAt)으로부터 현재까지 몇 분이 지났는지 계산 (기본값 0)
        const requestDate = new Date(task.requestedAt).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.floor((now - requestDate) / 60000);

        return {
        id: task.taskId,
        // 백엔드 명세에 tableNumber가 없다면 임시로 orderItemId 표기 (추후 백엔드 DTO에 테이블 번호 추가 필요)
        tableNumber: `T${task.orderItemId}`,
        request: "서빙요청", // 추후 메뉴명 등을 조합하여 표기 가능
        waitingTime: diffMinutes >= 0 ? diffMinutes : 0,
        active: task.status === "SERVE_REQUESTED",
        };
    }, []);

    // 1. [초기 로드] API로 대기 목록 가져오기 & 메뉴 목록 가져오기
    useEffect(() => {
        const fetchInitialData = async () => {
        try {
            // 메뉴 목록
            const menuRes = await getMenuList();
            setMenuList(menuRes.data);

            // 서빙 대기 목록 (GET API)
            const servingRes = await getServingCalls(boothId);

            // 가져온 데이터를 UI 모델에 맞게 변환하여 저장
            // (배열로 내려온다고 가정)
            if (Array.isArray(servingRes)) {
            const formattedList = servingRes.map(mapToUIModel);
            setStaffServeList(formattedList);
            }
        } catch (error) {
            console.error("데이터 초기화 실패:", error);
        }
        };
        fetchInitialData();
    }, [boothId, mapToUIModel]);

    // 2. [실시간 업데이트] 🌟 올바른 웹소켓 훅 호출 방식
    useServingWebSocket({
        enabled: true,
        onMessage: (type: ServingWsPayload["type"], data: ServingTaskResponse) => {
        setStaffServeList((prevList) => {
            const formattedData = mapToUIModel(data);

            switch (type) {
            case "NEW_CALL":
                // 새 콜이 들어오면 리스트 최상단에 추가
                return [formattedData, ...prevList];

            case "CATCH_CALL":
                // 누군가 수락해서 진행 중(SERVING)이 되면, 대기 리스트에서 빼거나 상태만 변경
                // (보통 다른 사람이 잡은 콜은 내 화면의 '요청' 탭에서 사라지는 것이 자연스러움)
                // 여기서는 리스트에서 제거하는 방식으로 구현 (기획에 따라 수정 가능)
                return prevList.filter((item) => item.id !== data.taskId);

            case "COMPLETE_CALL":
                // 완료된 콜도 화면에서 제거
                return prevList.filter((item) => item.id !== data.taskId);

            case "CANCEL_CALL":
                // 수락 취소된 콜은 다시 대기 목록으로 부활시켜야 함
                // 리스트에 없으면 새로 추가, 있으면 상태 덮어쓰기
                const isExist = prevList.some((item) => item.id === data.taskId);
                if (!isExist) {
                return [formattedData, ...prevList];
                } else {
                return prevList.map((item) =>
                    item.id === data.taskId ? formattedData : item
                );
                }

            default:
                return prevList;
            }
        });
        },
    });

    // 필터 버튼에 보여줄 첫 번째 메뉴 이름 추출
    const selectedMenuName =
        selectedMenuIds.length > 0
        ? menuList.find((m) => m.id === selectedMenuIds[0])?.name.replace("\n", " ")
        : undefined;

    return (
        <>
        <components.FilterBtn
            onMenuClick={() => setIsMenuFilterOpen(true)}
            onTableClick={() => setIsTableFilterOpen(true)}
            selectedMenuName={selectedMenuName}
            selectedTableRanges={selectedTableRanges}
            onMenuClear={(e) => {
            e.stopPropagation();
            setSelectedMenuIds([]);
            }}
            onTableClear={(e) => {
            e.stopPropagation();
            setSelectedTableRanges([]);
            }}
        />

        {/* 🌟 변환된 데이터 리스트와 이벤트 핸들러를 함께 넘겨줍니다 */}
        <StaffServeList list={staffServeList} onAcceptServe={onAcceptServe} />

        {isMenuFilterOpen && (
            <components.MenuFilterSheet
            initialSelectedMenus={selectedMenuIds}
            onApply={(ids) => setSelectedMenuIds(ids)}
            onClose={() => setIsMenuFilterOpen(false)}
            />
        )}

        {isTableFilterOpen && (
            <components.TableFilterSheet
            initialRanges={selectedTableRanges}
            onApply={(ranges) => setSelectedTableRanges(ranges)}
            onClose={() => setIsTableFilterOpen(false)}
            />
        )}
        </>
    );
};

export default StaffServe;