import * as S from "./StaffCall.styled";

import { useEffect, useState } from "react";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface StaffCallProps {
  id: number;
  tableNumber: string;
  request: string;
  waitingTime: number;
  active: boolean;
  createdAt?: string;
  onAccept?: () => void;
}
const StaffCall = (staffCallProps: StaffCallProps) => {
  const { tableNumber, request, waitingTime, active, createdAt, onAccept } =
    staffCallProps;

  // "몇 분 전"이 WS 없이도 최신으로 갱신되도록 1분마다 리렌더 트리거
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const minutesAgo = (() => {
    if (!createdAt) return null;
    const t = new Date(createdAt).getTime();
    if (Number.isNaN(t)) return null;
    // 보정: 현재 시간에서 9시간(=KST 오프셋) 빼서 비교
    const correctedNow = nowTick - 9 * 60 * 60 * 1000;
    const diffMs = correctedNow - t;
    if (diffMs < 0) return 0;
    return Math.floor(diffMs / (60 * 1000));
  })();

  // 5분 이하(최근)면 Focused 톤, 5분 초과면 기존 색 유지
  const isRecent = minutesAgo !== null ? minutesAgo <= 5 : false;

  return (
    <S.Wrapper>
      <S.LeftSection>
        <S.Table>
          <S.TableNumber $active={active}>{tableNumber}</S.TableNumber>
          <S.TableCall $active={active}>{request}</S.TableCall>
        </S.Table>
        <S.TableWaiting $active={active} $recent={isRecent}>
          <S.TableWaitingLogo
            $muted={!active || isRecent}
            src={
              active
                ? IMAGE_CONSTANTS.Timer.Activated
                : IMAGE_CONSTANTS.Timer.Unactivated
            }
            alt=""
          />
          {minutesAgo !== null
            ? minutesAgo === 0
              ? "방금"
              : `${minutesAgo}분 전`
            : waitingTime}
        </S.TableWaiting>
      </S.LeftSection>
      <S.StaffCallButton
        type="button"
        $active={active}
        disabled={!active}
        onClick={active ? onAccept : undefined}
      >
        수락
      </S.StaffCallButton>
    </S.Wrapper>
  );
};

export default StaffCall;
