// components/StaffServe/StaffServeList.tsx
import * as S from "./StaffServe.styled"; // 기존 스타일 재사용
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import StaffServeItem from "./StaffServeItem";

interface StaffServeUIItem {
  id: number;
  orderItemId: number;
  tableNumber: string;
  request: string;
  waitingTime: number;
  active: boolean;
}

interface StaffServeListProps {
  list: StaffServeUIItem[];
  // 🌟 StaffServe에서 내려받을 이벤트 함수 추가
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
          request={item.request}
          waitingTime={item.waitingTime}
          active={item.active}
          // 🌟 Item 컴포넌트로 전달
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
