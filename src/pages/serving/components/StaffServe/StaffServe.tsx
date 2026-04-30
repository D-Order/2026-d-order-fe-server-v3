import { useState, useEffect, useCallback } from "react";
import * as S from "./StaffServe.styled";
import components from "../index";
import StaffServeList from "./StaffServeList";
import { getMenuList, MenuItem } from "../../apis/getMenuList";
import { getServingCalls, ServingTaskResponse } from "../../apis/servingApi";
import {
    useServingWebSocket,
    ServingWsPayload,
} from "../../hooks/useServingWebSocket";

export interface StaffServeUIItem {
    id: number;
    orderItemId: number;
    tableNumber: string;
    rawTableNumber: number | null;
    request: string;
    waitingTime: number;
    active: boolean;
}

interface StaffServeProps {
    onUpdateServeCount?: (count: number) => void;
    // 상위(ServingPage)로 수락 이벤트를 올리기 위한 함수
    onAcceptServe?: (taskId: number, tableNumber: string, orderItemId: number) => void;
}

const StaffServe = ({ onUpdateServeCount, onAcceptServe }: StaffServeProps) => {
    const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
    const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

    const [selectedMenuIds, setSelectedMenuIds] = useState<(number | string)[]>([]);
    const [selectedTableRanges, setSelectedTableRanges] = useState<
        { start: string; end: string }[]
    >([]);

    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const [staffServeList, setStaffServeList] = useState<StaffServeUIItem[]>([]);

    useEffect(() => {
        onUpdateServeCount?.(staffServeList.length);
    }, [staffServeList, onUpdateServeCount]);

    const formatTableNumber = (tableNumber: number | null | undefined) => {
        if (typeof tableNumber === "number" && Number.isFinite(tableNumber)) {
        return `T${tableNumber}`;
        }

        return "T-";
    };

    const mapToUIModel = useCallback((task: ServingTaskResponse): StaffServeUIItem => {
        const requestDate = new Date(task.requestedAt).getTime();
        const now = new Date().getTime();
        const diffMinutes = Math.floor((now - requestDate) / 60000);

        return {
        id: task.taskId,
        orderItemId: task.orderItemId,
        tableNumber: formatTableNumber(task.tableNumber),
        rawTableNumber: task.tableNumber ?? null,
        request: "서빙요청",
        waitingTime: diffMinutes >= 0 ? diffMinutes : 0,
        active: task.status === "SERVE_REQUESTED",
        };
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
        try {
            const menuRes = await getMenuList();
            setMenuList(menuRes.data);

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
    }, [mapToUIModel]);

    useServingWebSocket({
        enabled: true,
        onMessage: (payload: ServingWsPayload) => {
        setStaffServeList((prevList) => {
            switch (payload.type) {
            case "NEW_CALL": {
                const formattedData = mapToUIModel(payload.data);

                const alreadyExists = prevList.some(
                (item) =>
                    item.id === formattedData.id ||
                    item.orderItemId === formattedData.orderItemId
                );

                if (alreadyExists) {
                return prevList;
                }

                return [formattedData, ...prevList];
            }

            case "REMOVE_CALL": {
                const { orderItemId, tableNumber } = payload.data;

                return prevList.filter((item) => {
                if (typeof orderItemId === "number") {
                    return item.orderItemId !== orderItemId;
                }

                if (typeof tableNumber === "number") {
                    return item.rawTableNumber !== tableNumber;
                }

                return true;
                });
            }

            case "CATCH_CALL": {
                const formattedData = mapToUIModel(payload.data);

                return prevList.map((item) =>
                item.id === formattedData.id ? formattedData : item
                );
            }

            case "COMPLETE_CALL": {
                return prevList.filter((item) => item.id !== payload.data.taskId);
            }

            case "CANCEL_CALL": {
                const formattedData = mapToUIModel(payload.data);
                const isExist = prevList.some((item) => item.id === formattedData.id);

                if (!isExist) {
                return [formattedData, ...prevList];
                }

                return prevList.map((item) =>
                item.id === formattedData.id ? formattedData : item
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
        <S.ServeColumn>
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
        </S.ServeColumn>
    );
};

export default StaffServe;