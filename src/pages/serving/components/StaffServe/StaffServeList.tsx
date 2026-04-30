// components/StaffServe/StaffServeList.tsx
import * as S from "./StaffServe.styled";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import StaffServeItem from "./StaffServeItem";

interface StaffServeUIItem {
  id: number;
  orderItemId: number;
  tableNumber: string;
  menuName: string;
  quantity: number;
  requestedAt?: string;
  active: boolean;
}

interface StaffServeListProps {
  list: StaffServeUIItem[];
  onAcceptServe?: (taskId: number, tableNumber: string, orderItemId: number) => void;
}

const StaffServeList = ({ list, onAcceptServe }: StaffServeListProps) => {
  const isEmpty = list.length === 0;
  return (
    <S.ListContainer $empty={isEmpty}>
      {list.map((item) => (
        <StaffServeItem
          key={item.id}
          id={item.id}
          orderItemId={item.orderItemId}
          tableNumber={item.tableNumber}
          menuName={item.menuName}
          quantity={item.quantity}
          requestedAt={item.requestedAt}
          active={item.active}
          onAccept={onAcceptServe}
        />
      ))}
      {isEmpty && (
        <S.NoDataWrapper>
          <S.NoDataImage src={IMAGE_CONSTANTS.sadKokkiri} />
          <S.NoDataText>
            요청이 없어요...
            <br />
            이참에 쉬어볼까요?
          </S.NoDataText>
        </S.NoDataWrapper>
      )}
    </S.ListContainer>
  );
};

export default StaffServeList;