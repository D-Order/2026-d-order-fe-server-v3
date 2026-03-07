import * as S from "./ServingPage.styled";
import { useState, useEffect } from "react";

import components from "./components";
import TableResetSheet from "./components/TableReset/TableResetSheet";
import Toast from "../../components/toast/Toast";

const ServingPage = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
          onSubmit={(tableNumber) => {
            // API 연결 후 삭제예정
            console.log("테이블 리셋 요청:", tableNumber);
            setToastMessage("테이블 초기화가 완료되었어요!");
          }}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
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
