import * as S from "./StaffServe.styled";

const getOrderElapsedText = (dateString?: string): string => {
  if (!dateString) return "주문 시간 확인 불가";
  const orderedTime = new Date(dateString).getTime();
  if (Number.isNaN(orderedTime)) return "주문 시간 확인 불가";

  const diffMs = Date.now() - orderedTime;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return "방금 전 주문";
  return `${diffMinutes}분 전 주문`;
};

interface StaffServeItemProps {
  id: number;
  orderItemId: number;
  tableNumber: string;
  menuName: string;
  quantity: number;
  requestedAt?: string;
  active: boolean;
  onAccept?: (taskId: number, tableNumber: string, orderItemId: number) => void;
}

const StaffServeItem = ({
  id,
  orderItemId,
  tableNumber,
  menuName,
  quantity,
  requestedAt,
  active,
  onAccept,
}: StaffServeItemProps) => {
  return (
    <S.ItemWrapper>
      <S.LeftSection>
        <S.Table>
          <S.TableNumber $active={active}>{tableNumber}</S.TableNumber>
          <S.TableCall $active={active}>{menuName}</S.TableCall>
        </S.Table>
        <S.TableMeta $active={active}>수량 {quantity}개</S.TableMeta>
        <S.TableWaiting $active={active}>{getOrderElapsedText(requestedAt)}</S.TableWaiting>
      </S.LeftSection>
      <S.StaffCallButton
        $active={active}
        onClick={() => {
          if (active && onAccept) onAccept(id, tableNumber, orderItemId);
        }}
      >
        수락
      </S.StaffCallButton>
    </S.ItemWrapper>
  );
};

export default StaffServeItem;