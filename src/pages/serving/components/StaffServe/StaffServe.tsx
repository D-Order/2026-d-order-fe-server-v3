import { useState, useEffect, useCallback, useMemo } from "react";
import * as S from "./StaffServe.styled";
import components from "../index";
import StaffServeList from "./StaffServeList";
import {
  getServingCalls,
  getServingFilterOptions,
  ServingFilterMenuOption,
  ServingTaskResponse,
} from "../../apis/servingApi";
import { useServingWebSocket, ServingWsPayload } from "../../hooks/useServingWebSocket";

export interface StaffServeUIItem {
  id: number;
  orderItemId: number;
  tableNumber: string;
  rawTableNumber: number | null;
  menuName: string;
  quantity: number;
  requestedAt?: string;
  active: boolean;
}

interface StaffServeProps {
  onUpdateServeCount?: (count: number) => void;
  onAcceptServe?: (taskId: number, tableNumber: string, orderItemId: number) => void;
}

const getMenuFilterLabel = (selectedMenus: string[]): string | undefined => {
  if (selectedMenus.length === 0) return undefined;
  if (selectedMenus.length === 1) return selectedMenus[0];
  return `${selectedMenus[0]} 외 ${selectedMenus.length - 1}건`;
};

const StaffServe = ({ onUpdateServeCount, onAcceptServe }: StaffServeProps) => {
  const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

  const [selectedMenuNames, setSelectedMenuNames] = useState<string[]>([]);
  const [selectedTableRanges, setSelectedTableRanges] = useState<{ start: string; end: string }[]>([]);

  const [menuList, setMenuList] = useState<ServingFilterMenuOption[]>([]);
  const [tableOptions, setTableOptions] = useState<number[]>([]);
  const [staffServeList, setStaffServeList] = useState<StaffServeUIItem[]>([]);

  const formatTableNumber = (tableNumber: number | null | undefined) => {
    if (typeof tableNumber === "number" && Number.isFinite(tableNumber)) return `T${tableNumber}`;
    return "T-";
  };

  const mapToUIModel = useCallback((task: ServingTaskResponse): StaffServeUIItem => {
    return {
      id: task.taskId,
      orderItemId: task.orderItemId,
      tableNumber: formatTableNumber(task.tableNumber),
      rawTableNumber: task.tableNumber ?? null,
      menuName: task.menuName ?? "메뉴 정보 없음",
      quantity: typeof task.quantity === "number" && task.quantity > 0 ? task.quantity : 1,
      requestedAt: task.requestedAt,
      active: task.status === "SERVE_REQUESTED",
    };
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servingRes, filterOptions] = await Promise.all([getServingCalls(), getServingFilterOptions()]);
        setMenuList((filterOptions.data.menus ?? []).filter((menu) => menu.name.trim() !== "테이블 이용료"));
        setTableOptions(filterOptions.data.tables ?? []);

        if (Array.isArray(servingRes)) {
          setStaffServeList(servingRes.map(mapToUIModel));
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
              (item) => item.id === formattedData.id || item.orderItemId === formattedData.orderItemId
            );
            if (alreadyExists) return prevList;
            return [formattedData, ...prevList];
          }
          case "REMOVE_CALL": {
            const { orderItemId, tableNumber } = payload.data;
            return prevList.filter((item) => {
              if (typeof orderItemId === "number") return item.orderItemId !== orderItemId;
              if (typeof tableNumber === "number") return item.rawTableNumber !== tableNumber;
              return true;
            });
          }
          case "CATCH_CALL": {
            const formattedData = mapToUIModel(payload.data);
            return prevList.map((item) => (item.id === formattedData.id ? formattedData : item));
          }
          case "COMPLETE_CALL":
            return prevList.filter((item) => item.id !== payload.data.taskId);
          case "CANCEL_CALL": {
            const formattedData = mapToUIModel(payload.data);
            const isExist = prevList.some((item) => item.id === formattedData.id);
            if (!isExist) return [formattedData, ...prevList];
            return prevList.map((item) => (item.id === formattedData.id ? formattedData : item));
          }
          default:
            return prevList;
        }
      });
    },
  });

  const filteredStaffServeList = useMemo(() => {
    return staffServeList.filter((item) => {
      const matchesMenu =
        selectedMenuNames.length === 0 || selectedMenuNames.includes(item.menuName);

      const matchesTable =
        selectedTableRanges.length === 0 ||
        (typeof item.rawTableNumber === "number" &&
          selectedTableRanges.some((range) => {
            const start = Number(range.start);
            const end = Number(range.end);
            if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
            const min = Math.min(start, end);
            const max = Math.max(start, end);
            return item.rawTableNumber! >= min && item.rawTableNumber! <= max;
          }));

      return matchesMenu && matchesTable;
    });
  }, [staffServeList, selectedMenuNames, selectedTableRanges]);

  useEffect(() => {
    onUpdateServeCount?.(filteredStaffServeList.length);
  }, [filteredStaffServeList, onUpdateServeCount]);

  const selectedMenuName = getMenuFilterLabel(selectedMenuNames);

  return (
    <S.ServeColumn>
      <components.FilterBtn
        onMenuClick={() => setIsMenuFilterOpen(true)}
        onTableClick={() => setIsTableFilterOpen(true)}
        selectedMenuName={selectedMenuName}
        selectedTableRanges={selectedTableRanges}
        onMenuClear={(e) => {
          e.stopPropagation();
          setSelectedMenuNames([]);
        }}
        onTableClear={(e) => {
          e.stopPropagation();
          setSelectedTableRanges([]);
        }}
      />

      <StaffServeList list={filteredStaffServeList} onAcceptServe={onAcceptServe} />

      {isMenuFilterOpen && (
        <components.MenuFilterSheet
          menuOptions={menuList}
          initialSelectedMenus={selectedMenuNames}
          onApply={(names) => setSelectedMenuNames(names)}
          onClose={() => setIsMenuFilterOpen(false)}
        />
      )}

      {isTableFilterOpen && (
        <components.TableFilterSheet
          tableOptions={tableOptions}
          initialRanges={selectedTableRanges}
          onApply={(ranges) => setSelectedTableRanges(ranges)}
          onClose={() => setIsTableFilterOpen(false)}
        />
      )}
    </S.ServeColumn>
  );
};

export default StaffServe;