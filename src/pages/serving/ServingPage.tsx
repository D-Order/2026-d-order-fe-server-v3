import * as S from "./ServingPage.styled";
import { useState, useEffect } from "react";

import components from "./components";

const ServingPage = () => {
    const [activeTab, setActiveTab] = useState<"StaffCall" | "StaffServe">(
        "StaffServe"
    );

    //리셋버튼 표기
    const [isVisible, setIsVisible] = useState(true);
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
        <components.ResetBtn isVisible={isVisible} />
        </S.Wrapper>
    );
};

export default ServingPage;
