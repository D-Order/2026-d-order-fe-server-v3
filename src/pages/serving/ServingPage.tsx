import * as S from "./ServingPage.styled";
import { useState, useEffect } from "react";

import components from "./components";
import TableResetSheet from "./components/TableReset/TableResetSheet";
import Toast from "../../components/toast/Toast";
import { useTableReset } from "@hooks/useTableReset";

import StaffServe from "./components/StaffServe/StaffServe";

const ServingPage = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"default" | "error">("default");
  const { resetTable, loading, error, data } = useTableReset();
  
  const [activeTab, setActiveTab] = useState<"StaffCall" | "StaffServe">("StaffServe");
  const [isVisible, setIsVisible] = useState(true);
  const [isTableResetOpen, setIsTableResetOpen] = useState(false);

  const [serveCount, setServeCount] = useState(0);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

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

  // 태준이형꺼
  const [StaffCallList, setStaffCallList] = useState<
    {
      id: number;
      tableNumber: string;
      request: string;
      waitingTime: number;
      active: boolean;
    }[]
  >([
    { id: 1, tableNumber: "T18", request: "결제확인요청", waitingTime: 10, active: true },
    { id: 2, tableNumber: "T19", request: "결제확인요청", waitingTime: 10, active: false },
  ]);

  const handleTabChange = (tab: "StaffCall" | "StaffServe") => {
    setActiveTab(tab);
  };

  return (
    <S.Wrapper>
      {/* 상단 탭 (개수 전달) */}
      <components.SelectTap 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        serveCount={serveCount} // 근우 서빙 개수 반영 태준이형 직원호출 반영해주세용
      />

      {/* 🌟 근우 서빙요청 탭이 활성화되었을 때 */}
      {activeTab === "StaffServe" && (
        <StaffServe onUpdateServeCount={setServeCount} />
      )}

      {/* 태준이형 직원호출 탭 */}
      {activeTab === "StaffCall" && (
        <components.StaffCallList StaffCallList={StaffCallList} />
      )}

      {/* 하단 공통 컴포넌트 유지 (초기화 버튼 및 시트) */}
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
    </S.Wrapper>
  );
};

export default ServingPage;