import * as S from "./StaffServe.styled";

const parseServerDate = (dateString?: string): Date | null => {
  if (!dateString) return null;

  const trimmed = dateString.trim();
  if (!trimmed) return null;

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(trimmed);
  const normalized = hasTimezone ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const getOrderElapsedText = (dateString?: string): string => {
  const requestedDate = parseServerDate(dateString);

  if (!requestedDate) return "주문 시간 확인 불가";

  const diffMs = Date.now() - requestedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return "방금 전";
  return `${diffMinutes}분 전`;
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
          <S.TableMeta $active={active}>{quantity}개</S.TableMeta>
        </S.Table>
        
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
