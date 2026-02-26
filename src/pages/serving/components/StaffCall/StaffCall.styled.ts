import styled from "styled-components";

export const Wrapper = styled.div`
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
  border-radius: 0.75rem;
  ${({ theme }) => theme.fonts.Bold14};
  color: ${({ theme }) => theme.colors.White};
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  display: flex;
  justify-content: center;
  align-items: center;
`;
