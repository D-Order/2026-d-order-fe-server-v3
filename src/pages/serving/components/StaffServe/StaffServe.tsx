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
    // 🌟 프론트엔드가 관리하던 boothId 제거
    
    const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
    const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

    const [selectedMenuIds, setSelectedMenuIds] = useState<(number | string)[]>([]);
    const [selectedTableRanges, setSelectedTableRanges] = useState<{ start: string; end: string }[]>([]);

    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const [staffServeList, setStaffServeList] = useState<StaffServeUIItem[]>([]);

    useEffect(() => {
        if (onUpdateServeCount) {
        onUpdateServeCount(staffServeList.length);
        }
    }, [staffServeList, onUpdateServeCount]);

    const mapToUIModel = useCallback((task: ServingTaskResponse): StaffServeUIItem => {
        const requestDate = new Date(task.requestedAt).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.floor((now - requestDate) / 60000);

        return {
        id: task.taskId,
        tableNumber: `T${task.orderItemId}`, // TODO: 백엔드 명세 확정 시 교체
        request: "서빙요청",
        waitingTime: diffMinutes >= 0 ? diffMinutes : 0,
        active: task.status === "SERVE_REQUESTED",
        };
    }, []);

    // 1. [초기 로드] API로 대기 목록 & 메뉴 가져오기
    useEffect(() => {
        const fetchInitialData = async () => {
        try {
            const menuRes = await getMenuList();
            setMenuList(menuRes.data);

            // 🌟 boothId 인자 제거
            const servingRes = await getServingCalls(); 

            if (Array.isArray(servingRes)) {
            const formattedList = servingRes.map(mapToUIModel);
            setStaffServeList(formattedList);
            }
        } catch (error) {
            console.error("데이터 초기화 실패:", error);
        }
        };
        fetchInitialData();
    }, [mapToUIModel]); // 🌟 의존성 배열에서 boothId 제거

    // 2. [실시간 업데이트] 웹소켓 훅 (기존과 동일)
    useServingWebSocket({
        enabled: true,
        onMessage: (type: ServingWsPayload["type"], data: ServingTaskResponse) => {
        setStaffServeList((prevList) => {
            const formattedData = mapToUIModel(data);

            switch (type) {
            case "NEW_CALL":
                return [formattedData, ...prevList];
            case "CATCH_CALL":
            case "COMPLETE_CALL":
                return prevList.filter((item) => item.id !== data.taskId);
            case "CANCEL_CALL":
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