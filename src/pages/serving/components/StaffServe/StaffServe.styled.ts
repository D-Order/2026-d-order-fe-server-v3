// components/StaffServe/StaffServeItem.styled.ts (또는 해당 스타일 파일)
import styled from "styled-components";

// ==========================================
// StaffServeItem 컴포넌트용 스타일
// ==========================================

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ItemWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.White};
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1rem;
  border-radius: 1rem;
  gap: 0.625rem;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
`;

export const LeftSection = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const Table = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
`;

export const TableNumber = styled.div<{ $active: boolean }>`
  width: fit-content;
  height: fit-content;
  ${({ theme }) => theme.fonts.SemiBold14};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.Orange01 : theme.colors.Focused};
`;

export const TableCall = styled.div<{ $active: boolean }>`
  width: fit-content;
  height: fit-content;
  ${({ theme }) => theme.fonts.Bold18};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.Black01 : theme.colors.Focused};
`;

// tsx에서 $recent를 넘겨주지 않으므로 $active만 받도록 수정
export const TableWaiting = styled.div<{ $active: boolean }>`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;

  ${({ theme }) => theme.fonts.Bold12};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.Orange01 : theme.colors.Focused};
`;

// tsx에서 $muted 대신 이미지 src 자체를 교체하므로 불필요한 props 제거
export const TableWaitingLogo = styled.img`
  width: 0.75rem;
  height: 0.75rem;
  object-fit: contain;
`;

export const StaffCallButton = styled.button<{ $active: boolean }>`
  width: 4rem;
  height: 3rem;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.Orange01 : theme.colors.Focused};
  border: none;
  border-radius: 0.75rem;
  ${({ theme }) => theme.fonts.Bold14};
  color: ${({ theme }) => theme.colors.White};
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ==========================================
// 기존 스타일 유지 (리스트 컨테이너 및 NoData 등)
// ==========================================

// 기존 Wrapper는 개별 Item의 Wrapper와 이름이 충돌하므로 ListWrapper로 변경했습니다.
// (부모 컴포넌트에서 리스트를 감쌀 때 사용하시면 됩니다)
export const ListWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(100dvh - 12rem);
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const NoDataWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 50vh;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const NoDataImage = styled.img`
  width: 10rem;
  height: 6rem;
  object-fit: contain;
`;

export const NoDataText = styled.p`
  ${({ theme }) => theme.fonts.ExtraBold24};
  color: ${({ theme }) => theme.colors.Focused};
  text-align: center;
  line-height: 2;
  white-space: pre-line;
`;