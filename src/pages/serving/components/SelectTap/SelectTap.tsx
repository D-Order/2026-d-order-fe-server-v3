import * as S from "./SelectTap.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface SelectTapProps {
  activeTab: "StaffCall" | "StaffServe";
  onTabChange: (tab: "StaffCall" | "StaffServe") => void;
  serveCount?: number;
}

const SelectTap = ({ activeTab, onTabChange, serveCount = 0}: SelectTapProps) => {
  const handleTabClick = (tab: "StaffCall" | "StaffServe") => {
    onTabChange(tab);
  };

  return (
    <S.Wrapper>
      <S.Buttons>
        <S.Button
          $active={activeTab === "StaffServe"}
          onClick={() => handleTabClick("StaffServe")}
        >
          <S.ButtonIcon
            src={
              activeTab === "StaffServe"
                ? IMAGE_CONSTANTS.TabSection.StaffServe_activated
                : IMAGE_CONSTANTS.TabSection.StaffServe_unactivated
            }
          />
          <S.ButtonText $active={activeTab === "StaffServe"}>
            {/* 🌟 수정: 하드코딩 지우고 받아온 데이터 반영 */}
            서빙요청 ({serveCount})
          </S.ButtonText>
        </S.Button>
        <S.Button
          $active={activeTab === "StaffCall"}
          onClick={() => handleTabClick("StaffCall")}
        >
          <S.ButtonIcon
            src={
              activeTab === "StaffCall"
                ? IMAGE_CONSTANTS.TabSection.StaffCall_activated
                : IMAGE_CONSTANTS.TabSection.StaffCall_unactivated
            }
          />
          <S.ButtonText $active={activeTab === "StaffCall"}>
            직원 호출(4)
          </S.ButtonText>
        </S.Button>
      </S.Buttons>
    </S.Wrapper>
  );
};

export default SelectTap;
