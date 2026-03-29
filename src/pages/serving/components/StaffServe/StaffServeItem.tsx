// components/StaffServe/StaffServeItem.tsx
import * as S from "../StaffCall/StaffCall.styled"; // 태준이형 스타일 날먹...ㅎㅎ
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface StaffServeItemProps {
    id: number;
    tableNumber: string;
    request: string;
    waitingTime: number;
    active: boolean;
}

const StaffServeItem = ({ id, tableNumber, request, waitingTime, active }: StaffServeItemProps) => {
    return (
        <S.Wrapper>
        <S.LeftSection>
            <S.Table>
            <S.TableNumber $active={active}>{tableNumber}</S.TableNumber>
            <S.TableCall $active={active}>{request}</S.TableCall>
            </S.Table>
            <S.TableWaiting $active={active}>
            <S.TableWaitingLogo
                src={active ? IMAGE_CONSTANTS.Timer.Activated : IMAGE_CONSTANTS.Timer.Unactivated}
            />
            {waitingTime}
            </S.TableWaiting>
        </S.LeftSection>
        <S.StaffCallButton $active={active}>수락</S.StaffCallButton>
        </S.Wrapper>
    );
};

export default StaffServeItem;