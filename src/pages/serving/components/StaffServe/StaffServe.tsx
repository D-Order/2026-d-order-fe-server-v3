    import { useState, useEffect } from "react";
    import components from "../index";
    import StaffServeList from "./StaffServeList";
    import { getMenuList, MenuItem } from "../../apis/getMenuList"; 
    import { getServingCalls, ServingTaskResponse } from "../../apis/servingApi";
    import { useServingWebSocket } from "../../hooks/useServingWebSocket";

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
    // 🌟 상위(ServingPage)로 수락 이벤트를 올리기 위한 함수
    onAcceptServe?: (taskId: number, tableNumber: string) => void;
    }

    const StaffServe = ({ onUpdateServeCount, onAcceptServe }: StaffServeProps) => {
    const boothId = 1; // TODO: 실제 전역 상태나 Context에서 가져오도록 수정 필요

    const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
    const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

    const [selectedMenuIds, setSelectedMenuIds] = useState<(number | string)[]>([]);
    const [selectedTableRanges, setSelectedTableRanges] = useState<{start: string, end: string}[]>([]);
    
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    
    // 🌟 실제 서버 데이터를 담을 State
    const [staffServeList, setStaffServeList] = useState<StaffServeUIItem[]>([]);

    // 🌟 실시간 웹소켓 훅 연결
    const newTask = useServingWebSocket();

    // 백엔드 DTO -> 프론트 UI 모델로 변환하는 헬퍼 함수
    const mapToUIModel = (task: ServingTaskResponse): StaffServeUIItem => {
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
        active: task.status === "SERVE_REQUESTED"
        };
    };
    
    useEffect(() => {
        if (onUpdateServeCount) {
        onUpdateServeCount(staffServeList.length);
        }
    }, [staffServeList, onUpdateServeCount]);

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
            const formattedList = servingRes.map(mapToUIModel);
            setStaffServeList(formattedList);
        } catch (error) {
            console.error("데이터 초기화 실패:", error);
        }
        };
        fetchInitialData();
    }, [boothId]);

    // 2. [실시간 업데이트] 웹소켓으로 새 알림(newTask)이 올 때마다 리스트 최상단에 추가
    useEffect(() => {
        if (newTask) {
        const formattedNewTask = mapToUIModel(newTask);
        setStaffServeList((prev) => [formattedNewTask, ...prev]);
        }
    }, [newTask]);

    
    // 필터 버튼에 보여줄 첫 번째 메뉴 이름 추출
    const selectedMenuName = selectedMenuIds.length > 0 
        ? menuList.find(m => m.id === selectedMenuIds[0])?.name.replace("\n", " ") 
        : undefined;

    return (
        <>
        <components.FilterBtn
            onMenuClick={() => setIsMenuFilterOpen(true)}
            onTableClick={() => setIsTableFilterOpen(true)}
            selectedMenuName={selectedMenuName}
            selectedTableRanges={selectedTableRanges}
            onMenuClear={(e) => { e.stopPropagation(); setSelectedMenuIds([]); }}
            onTableClear={(e) => { e.stopPropagation(); setSelectedTableRanges([]); }}
        />

        {/* 🌟 변환된 데이터 리스트와 이벤트 핸들러를 함께 넘겨줍니다 */}
        <StaffServeList 
            list={staffServeList} 
            onAcceptServe={onAcceptServe} 
        />

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