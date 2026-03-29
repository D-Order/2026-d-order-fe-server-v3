// components/StaffServe/StaffServeList.tsx
import * as S from "./StaffServe.styled"; // 기존 스타일 재사용
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import StaffServeItem from "./StaffServeItem";

interface StaffServeListProps {
    list: {
        id: number;
        tableNumber: string;
        request: string;
        waitingTime: number;
        active: boolean;
    }[];
}

const StaffServeList = ({ list }: StaffServeListProps) => {
    return (
        <S.Wrapper>
        {list.map((item) => (
            <StaffServeItem
            key={item.id}
            id={item.id}
            tableNumber={item.tableNumber}
            request={item.request}
            waitingTime={item.waitingTime}
            active={item.active}
            />
        ))}
        {list.length === 0 && (
            <S.NoDataWrapper>
            <S.NoDataImage src={IMAGE_CONSTANTS.sadKokkiri} />
            <S.NoDataText>
                요청이 없어요...
                <br />
                이참에 쉬어볼까요?
            </S.NoDataText>
            </S.NoDataWrapper>
        )}
        </S.Wrapper>
    );
};

export default StaffServeList;