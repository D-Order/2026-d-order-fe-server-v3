// components/StaffServe/StaffServeItem.tsx
import * as S from "./StaffServe.styled"; // 태준이형 스타일 날먹...ㅎㅎ
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface StaffServeItemProps {
  id: number;
  orderItemId: number;
  tableNumber: string;
  request: string;
  waitingTime: number;
  active: boolean;
  // 🌟 상위에서 내려받을 수락 함수 추가
  onAccept?: (taskId: number, tableNumber: string, orderItemId: number) => void;
}

const StaffServeItem = ({
  id,
  orderItemId,
  tableNumber,
  request,
  waitingTime,
  active,
  onAccept,
}: StaffServeItemProps) => {
  return (
    <S.ItemWrapper>
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
      <S.StaffCallButton
        $active={active}
        onClick={() => {
          if (active && onAccept) {
            onAccept(id, tableNumber, orderItemId);
          }
        }}
      >
        수락
      </S.StaffCallButton>
    </S.ItemWrapper>
  );
};

export default StaffServeItem;
