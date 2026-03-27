import * as S from "./ServingPage.styled";
import { useState, useEffect } from "react";

import components from "./components";
import TableResetSheet from "./components/TableReset/TableResetSheet";
import Toast from "../../components/toast/Toast";
import { useTableReset } from "@hooks/useTableReset";

const ServingPage = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"default" | "error">("default");
  const { resetTable, loading, error, data } = useTableReset();
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

  const [StaffCallList, setStaffCallList] = useState<
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
      tableNumber: "T18",
      request: "결제확인요청",
      waitingTime: 10,
      active: true,
    },
    {
      id: 2,
      tableNumber: "T19",
      request: "결제확인요청",
      waitingTime: 10,
      active: false,
    },
  ]);

  const [StaffServeList, setStaffServeList] = useState<
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

  return (
    <S.Wrapper>
      <components.SelectTap
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
        <components.StaffCallList StaffCallList={StaffCallList} />
      )}
      <components.ResetBtn
        isVisible={isVisible}
        onClick={() => setIsTableResetOpen(true)}
      />

      {isTableResetOpen && (
        <TableResetSheet
          onClose={() => setIsTableResetOpen(false)}
          onSubmit={async (tableNumber) => {
            // 1. 훅에서 반환한 결과값을 변수에 담습니다.
            const result = await resetTable({
              table_nums: [Number(tableNumber)],
            });

            // 2. 결과값을 바탕으로 토스트 메시지를 띄웁니다.
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
    </S.Wrapper>
  );
};

export default ServingPage;
