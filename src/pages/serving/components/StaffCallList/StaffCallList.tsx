import * as S from "./StaffCallList.styled";

import components from "../index";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

export interface StaffCallRowItem {
  id: number;
  tableNumber: string;
  request: string;
  waitingTime: number;
  active: boolean;
  tableId?: number;
  cartId?: number;
  callType?: string;
  status?: string;
  createdAt?: string;
  tableUsageId?: number;
}

interface StaffCallListProps {
  StaffCallList: StaffCallRowItem[];
  /** 상위에서 내려주는 현재시간 tick(ms). 없으면 카드 내부에서 계산 불가 시 fallback */
  nowTick?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** 수락 클릭 시 모달을 띄우기 위해 전체 항목 전달 */
  onRequestAccept?: (item: StaffCallRowItem) => void;
}

const StaffCallList = (StaffCallListProps: StaffCallListProps) => {
  return (
    <S.Wrapper $empty={StaffCallListProps.StaffCallList.length === 0}>
      {StaffCallListProps.StaffCallList.map((item) => (
        <components.StaffCall
          key={item.id}
          id={item.id}
          tableNumber={item.tableNumber}
          request={item.request}
          waitingTime={item.waitingTime}
          active={item.active}
          createdAt={item.createdAt}
          nowTick={StaffCallListProps.nowTick}
          onAccept={
            StaffCallListProps.onRequestAccept &&
            typeof item.tableId === "number" &&
            item.tableId > 0 &&
            typeof item.cartId === "number" &&
            item.cartId > 0 &&
            item.callType
              ? () => StaffCallListProps.onRequestAccept?.(item)
              : undefined
          }
        />
      ))}
      {StaffCallListProps.StaffCallList.length === 0 && (
        <S.NoDataWrapper>
          <S.NoDataImage src={IMAGE_CONSTANTS.sadKokkiri} />
          <S.NoDataText>
            호출이 없어요...
            <br />
            이참에 쉬어볼까요?
          </S.NoDataText>
        </S.NoDataWrapper>
      )}
    </S.Wrapper>
  );
};

export default StaffCallList;
