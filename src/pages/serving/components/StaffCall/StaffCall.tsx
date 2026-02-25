import * as S from "./StaffCall.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface StaffCallProps {
  id: number;
  tableNumber: string;
  request: string;
  waitingTime: number;
  active: boolean;
}
const StaffCall = (staffCallProps: StaffCallProps) => {
  const { id, tableNumber, request, waitingTime, active } = staffCallProps;
  return (
    <S.Wrapper>
      <S.LeftSection>
        <S.Table>
          <S.TableNumber $active={active}>{tableNumber}</S.TableNumber>
          <S.TableCall $active={active}>{request}</S.TableCall>
        </S.Table>
        <S.TableWaiting $active={active}>
          <S.TableWaitingLogo
            src={
              active
                ? IMAGE_CONSTANTS.Timer.Activated
                : IMAGE_CONSTANTS.Timer.Unactivated
            }
          />
          {waitingTime}
        </S.TableWaiting>
      </S.LeftSection>
      <S.StaffCallButton $active={active}>수락</S.StaffCallButton>
    </S.Wrapper>
  );
};

export default StaffCall;
