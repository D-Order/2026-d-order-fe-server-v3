import * as S from "./ServingPage.styled";
import { useState, useEffect } from "react";

import components from "./components";
import TableResetSheet from "./components/TableReset/TableResetSheet";
import Toast from "../../components/toast/Toast";
import { useTableReset } from "@hooks/useTableReset";
import {
  StaffCallItem,
  staffCallAcceptApi,
  staffCallCancelApi,
} from "../../apis/staffCallApi";
import { useUser } from "@stores/UserContext";
import ServingAcceptModal from "@components/servingacceptmoal/ServingAcceptModal";
import { useStaffCallListSocket } from "@hooks/useStaffCallListSocket";

import StaffServe from "./components/StaffServe/StaffServe";

import {
  servingCatchApi,
  servingCompleteApi,
  servingCancelApi,
} from "./apis/servingApi";

const ServingPage = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"default" | "error">("default");
  
  const { resetTable } = useTableReset();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"StaffCall" | "StaffServe">("StaffServe");
  const [isVisible, setIsVisible] = useState(true);
  const [isTableResetOpen, setIsTableResetOpen] = useState(false);

  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const [serveCount, setServeCount] = useState(0);

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  interface StaffCallListItem {
    id: number;
    tableNumber: string;
    request: string;
    waitingTime: number;
    active: boolean;
    tableId: number;
    cartId: number;
    callType: string;
    status?: string;
    createdAt?: string;
  }

  const mapStaffCallItem = (
    raw: StaffCallItem,
    index: number
  ): StaffCallListItem => {
    const id = Number(raw?.id ?? index + 1);
    const tableId = Number((raw as any)?.table_id ?? (raw as any)?.tableId);
    const cartId = Number((raw as any)?.cart_id ?? (raw as any)?.cartId);
    const callType = String(
      (raw as any)?.call_type ?? (raw as any)?.callType ?? ""
    );

    const rawTableNum =
      (raw as any)?.table_num ??
      (raw as any)?.tableNum ??
      (raw as any)?.tableNumber ??
      (raw as any)?.table_no;
    const tableNumber =
      typeof rawTableNum === "number"
        ? `T${rawTableNum}`
        : typeof rawTableNum === "string"
          ? rawTableNum.startsWith("T")
            ? rawTableNum
            : rawTableNum.trim() === ""
              ? ""
              : `T${rawTableNum}`
          : tableId
            ? `T${tableId}`
            : "";

    const waitingTime = Number(
      (raw as any)?.waiting_sec ??
        (raw as any)?.waitingTime ??
        (raw as any)?.waiting_time ??
        0
    );

    const statusRaw = String((raw as any)?.status ?? "")
      .trim()
      .toUpperCase();
    const isAccepted =
      statusRaw === "ACCEPTED" ||
      statusRaw === "ACCEPT" ||
      statusRaw === "ACCEPTED_BY_STAFF";

    const canAccept =
      Number.isFinite(tableId) &&
      tableId > 0 &&
      Number.isFinite(cartId) &&
      cartId > 0 &&
      callType.trim() !== "" &&
      !isAccepted;

    return {
      id: Number.isFinite(id) ? id : index + 1,
      tableNumber,
      request: callType,
      waitingTime: Number.isFinite(waitingTime) ? waitingTime : 0,
      active: canAccept,
      tableId: Number.isFinite(tableId) ? tableId : 0,
      cartId: Number.isFinite(cartId) ? cartId : 0,
      callType,
      status: statusRaw || undefined,
      createdAt: (raw as any)?.created_at ?? (raw as any)?.createdAt,
    };
  };

  const [StaffCallList, setStaffCallList] = useState<StaffCallListItem[]>([]);
  const [staffCallTotal, setStaffCallTotal] = useState<number>(0);
  
  // 직원 호출(StaffCall) 모달 데이터
  const [acceptModalItem, setAcceptModalItem] = useState<StaffCallListItem | null>(null);
  
  // 서빙 요청(StaffServe) 모달 데이터
  const [serveModalItem, setServeModalItem] = useState<{
    taskId: number;
    tableNumber: string;
  } | null>(null);

  const staffCallWsEnabled =
    activeTab === "StaffCall" && Boolean(user?.booth_id);

  const {
    isRefreshing: isStaffCallRefreshing,
    requestList: requestStaffCallList,
  } = useStaffCallListSocket({
    enabled: staffCallWsEnabled,
    onListUpdate: ({ items, total }) => {
      setStaffCallList(
        items.map((raw, i) => mapStaffCallItem(raw as StaffCallItem, i))
      );
      if (typeof total === "number") {
        setStaffCallTotal(total);
      }
    },
    onError: (message) => {
      setToastMessage(message);
      setToastType("error");
    },
  });

  const handleTabChange = (tab: "StaffCall" | "StaffServe") => {
    setActiveTab(tab);
  };

  /* ================= 직원 호출 (StaffCall) 로직 ================= */
  const handleAccept = async (payload: {
    tableId: number;
    cartId: number;
    callType: string;
  }): Promise<boolean> => {
    if (
      !Number.isFinite(payload.tableId) || payload.tableId <= 0 ||
      !Number.isFinite(payload.cartId) || payload.cartId <= 0 ||
      payload.callType.trim() === ""
    ) {
      setToastMessage("수락에 필요한 정보가 부족합니다. 목록을 새로고침 해주세요.");
      setToastType("error");
      return false;
    }

    try {
      const res = await staffCallAcceptApi(payload);
      setToastMessage(res.message || "호출을 수락했습니다.");
      setToastType("default");
      requestStaffCallList();
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message || err?.message || "호출 수락에 실패했습니다.";
      setToastMessage(msg);
      setToastType("error");
      if (status === 409) {
        requestStaffCallList();
      }
      return false;
    }
  };

  const handleRequestAccept = async (item: {
    tableId?: number;
    cartId?: number;
    callType?: string;
  }) => {
    const ok = await handleAccept({
      tableId: item.tableId as number,
      cartId: item.cartId as number,
      callType: item.callType as string,
    });
    if (ok) {
      setAcceptModalItem(item as StaffCallListItem);
    }
  };

  const handleModalCancelAccept = async () => {
    if (!acceptModalItem) return;
    const { tableId, cartId, callType } = acceptModalItem;
    if (!tableId || !cartId || !callType) {
      setToastMessage("취소에 필요한 정보가 부족합니다.");
      setToastType("error");
      return;
    }
    try {
      const res = await staffCallCancelApi({ tableId, cartId, callType });
      setToastMessage(res.message || "호출 수락을 취소했습니다.");
      setToastType("default");
      setAcceptModalItem(null);
      requestStaffCallList();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message || err?.message || "호출 수락 취소에 실패했습니다.";
      setToastMessage(msg);
      setToastType("error");
      if (status === 409) {
        requestStaffCallList();
      }
    }
  };

  /* ================= 서빙 요청 (StaffServe) 로직 ================= */
  
  const currentBoothId = user?.booth_id || 1;

  // 1. 서빙 시작 (수락)
  const handleServeCatch = async (taskId: number, tableNumber: string) => {
    try {
      // 🌟 taskId와 boothId만 전송
      const resMsg = await servingCatchApi(taskId, currentBoothId); 
      setToastMessage(resMsg || "서빙을 시작합니다.");
      setToastType("default");
      setServeModalItem({ taskId, tableNumber });
    } catch (err: any) {
      if (err?.response?.status === 409) {
        alert("앗! 다른 직원이 먼저 수락한 콜입니다.");
      } else {
        setToastMessage(err?.response?.data?.message || "서빙 수락에 실패했습니다.");
        setToastType("error");
      }
    }
  };

  // 2. 서빙 완료 (클릭)
  const handleServeComplete = async () => {
    if (!serveModalItem) return;
    try {
      const resMsg = await servingCompleteApi(serveModalItem.taskId, currentBoothId); 
      setToastMessage(resMsg || "서빙이 완료되었습니다.");
      setToastType("default");
      setServeModalItem(null);
    } catch (err: any) {
      setToastMessage(err?.response?.data?.message || "서빙 완료 처리에 실패했습니다.");
      setToastType("error");
    }
  };

  // 3. 서빙 취소 (뒤로가기)
  const handleServeCancel = async () => {
    if (!serveModalItem) return;
    try {
      const resMsg = await servingCancelApi(serveModalItem.taskId, currentBoothId); 
      setToastMessage(resMsg || "서빙을 취소했습니다.");
      setToastType("default");
      setServeModalItem(null); 
    } catch (err: any) {
      setToastMessage(err?.response?.data?.message || "서빙 취소 처리에 실패했습니다.");
      setToastType("error");
    }
  };

  return (
    <S.Wrapper>
      <components.SelectTap 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        staffServeCount={serveCount}
        staffCallCount={staffCallTotal}
      />

      {activeTab === "StaffServe" && (
        <StaffServe 
          onUpdateServeCount={setServeCount}
          onAcceptServe={(taskId, tableNumber) => handleServeCatch(taskId, tableNumber)}
        />
      )}

      {activeTab === "StaffCall" && (
        <components.StaffCallList
          StaffCallList={StaffCallList}
          nowTick={nowTick}
          onRefresh={requestStaffCallList}
          refreshing={isStaffCallRefreshing}
          onRequestAccept={(item) => void handleRequestAccept(item)}
        />
      )}

      <components.ResetBtn
        isVisible={isVisible}
        onClick={() => setIsTableResetOpen(true)}
      />

      {isTableResetOpen && (
        <TableResetSheet
          onClose={() => setIsTableResetOpen(false)}
          onSubmit={async (tableNumber) => {
            const result = await resetTable({
              table_nums: [Number(tableNumber)],
            });

            if (!result.success) {
              setToastMessage(result.errorMsg || "에러가 발생했습니다.");
              setToastType("error");
            } else {
              setToastMessage(result.payload?.message || "초기화 성공");
              setToastType("default");
            }
          }}
        />
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* 직원호출 모달 */}
      {acceptModalItem && (
        <S.AcceptModalLayer>
          <ServingAcceptModal
            callType={acceptModalItem.callType}
            tableNumberText={acceptModalItem.tableNumber}
            onCancelAccept={() => void handleModalCancelAccept()}
          />
        </S.AcceptModalLayer>
      )}

      {/* 서빙(StaffServe) 전용 모달 */}
      {serveModalItem && (
        <S.AcceptModalLayer>
          <ServingAcceptModal
            variant="serviceClick"
            tableNumberText={serveModalItem.tableNumber}
            onClickComplete={() => void handleServeComplete()} 
            onCancelAccept={() => void handleServeCancel()} 
          />
        </S.AcceptModalLayer>
      )}
    </S.Wrapper>
  );
};

export default ServingPage;