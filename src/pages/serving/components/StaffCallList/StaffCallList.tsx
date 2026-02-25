import * as S from "./StaffCallList.styled";

import components from "../index";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface StaffCallListProps {
  StaffCallList: {
    id: number;
    tableNumber: string;
    request: string;
    waitingTime: number;
    active: boolean;
  }[];
}

const StaffCallList = (StaffCallListProps: StaffCallListProps) => {
  return (
    <S.Wrapper>
      {StaffCallListProps.StaffCallList.map((item) => (
        <components.StaffCall
          key={item.id}
          id={item.id}
          tableNumber={item.tableNumber}
          request={item.request}
          waitingTime={item.waitingTime}
          active={item.active}
        />
      ))}
      {StaffCallListProps.StaffCallList.length === 0 && (
        <S.NoDataWrapper>
          <S.NoDataImage src={IMAGE_CONSTANTS.sadKokkiri} />
          <S.NoDataText>
            호출이 없어요...
            <br />
            이참이 쉬어볼까요?
          </S.NoDataText>
        </S.NoDataWrapper>
      )}
    </S.Wrapper>
  );
};

export default StaffCallList;
