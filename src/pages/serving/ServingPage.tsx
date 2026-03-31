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

const ServingPage = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"default" | "error">("default");
  const { resetTable } = useTableReset();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"StaffCall" | "StaffServe">(
    "StaffServe"
  );

  const [isMenuFilterOpen, setIsMenuFilterOpen] = useState(false);
  const [isTableFilterOpen, setIsTableFilterOpen] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [isTableResetOpen, setIsTableResetOpen] = useState(false);
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(false);
      // 타이머 설정 (새로운 조정 없으면 다시 보이게) -> 지금은 200ms
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
  const [acceptModalItem, setAcceptModalItem] =
    useState<StaffCallListItem | null>(null);

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

  const [StaffServeList] = useState<
    {
      id: number;
      tableNumber: string;
      request: string;
      waitingTime: number;
      active: boolean;
    }[]
  >([
    {
      id: 1,
      tableNumber: "T20",
      request: "서빙요청",
      waitingTime: 10,
      active: true,
    },
    {
      id: 2,
      tableNumber: "T21",
      request: "서빙요청",
      waitingTime: 10,
      active: false,
    },
  ]);

  const handleTabChange = (tab: "StaffCall" | "StaffServe") => {
    setActiveTab(tab);
  };

  /** 수락 API만 호출. 성공 시 true (모달은 별도로 열림). 슬라이드는 추후 다른 동작에 연결 예정. */
  const handleAccept = async (payload: {
    tableId: number;
    cartId: number;
    callType: string;
  }): Promise<boolean> => {
    if (
      !Number.isFinite(payload.tableId) ||
      payload.tableId <= 0 ||
      !Number.isFinite(payload.cartId) ||
      payload.cartId <= 0 ||
      payload.callType.trim() === ""
    ) {
      setToastMessage(
        "수락에 필요한 정보가 부족합니다. 목록을 새로고침 해주세요."
      );
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
        err?.response?.data?.message ||
        err?.message ||
        "호출 수락에 실패했습니다.";
      setToastMessage(status === 409 ? msg : msg);
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

  /** 모달 좌상단: 수락 취소(ACCEPTED → PENDING). 409 시 서버 message 토스트 */
  const handleModalCancelAccept = async () => {
    if (!acceptModalItem) return;
    const { tableId, cartId, callType } = acceptModalItem;
    if (!tableId || !cartId || !callType) {
      setToastMessage("취소에 필요한 정보가 부족합니다.");
      setToastType("error");
      return;
    }
    try {
      const res = await staffCallCancelApi({
        tableId,
        cartId,
        callType,
      });
      setToastMessage(res.message || "호출 수락을 취소했습니다.");
      setToastType("default");
      setAcceptModalItem(null);
      requestStaffCallList();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "호출 수락 취소에 실패했습니다.";
      setToastMessage(msg);
      setToastType("error");
      if (status === 409) {
        requestStaffCallList();
      }
    }
  };

  return (
    <S.Wrapper>
      <components.SelectTap
        activeTab={activeTab}
        onTabChange={handleTabChange}
        staffServeCount={StaffServeList.length}
        staffCallCount={staffCallTotal}
      />

      {/* StaffServe 탭일 때만 필터링 버튼 렌더링 */}
      {activeTab === "StaffServe" && (
        <components.FilterBtn
          onMenuClick={() => setIsMenuFilterOpen(true)}
          onTableClick={() => setIsTableFilterOpen(true)}
        />
      )}

      {activeTab === "StaffServe" && (
        <components.StaffCallList StaffCallList={StaffServeList} />
      )}
      {activeTab === "StaffCall" && (
        <components.StaffCallList
          StaffCallList={StaffCallList}
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

      {isMenuFilterOpen && (
        <components.MenuFilterSheet
          onClose={() => setIsMenuFilterOpen(false)}
        />
      )}
      {isTableFilterOpen && (
        <components.TableFilterSheet
          onClose={() => setIsTableFilterOpen(false)}
        />
      )}

      {acceptModalItem && (
        <S.AcceptModalLayer>
          <ServingAcceptModal
            callType={acceptModalItem.callType}
            onCancelAccept={() => void handleModalCancelAccept()}
          />
        </S.AcceptModalLayer>
      )}
    </S.Wrapper>
  );
};

export default ServingPage;
