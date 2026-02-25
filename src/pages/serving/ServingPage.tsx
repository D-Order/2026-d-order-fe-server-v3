import * as S from "./ServingPage.styled";
import { useState } from "react";

import components from "./components";

const ServingPage = () => {
  const [activeTab, setActiveTab] = useState<"StaffCall" | "StaffServe">(
    "StaffServe"
  );

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
      request: "결제확인요청",
      waitingTime: 10,
      active: true,
    },
    {
      id: 2,
      tableNumber: "T21",
      request: "결제확인요청",
      waitingTime: 10,
      active: false,
    },
  ]);

  const handleTabChange = (tab: "StaffCall" | "StaffServe") => {
    setActiveTab(tab);
  };

  return (
    <S.Wrapper>
      <components.Header />
      <components.SelectTap
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      {activeTab === "StaffServe" && (
        <components.StaffCallList StaffCallList={StaffServeList} />
      )}
      {activeTab === "StaffCall" && (
        <components.StaffCallList StaffCallList={StaffCallList} />
      )}
      <components.ResetBtn />
    </S.Wrapper>
  );
};

export default ServingPage;
