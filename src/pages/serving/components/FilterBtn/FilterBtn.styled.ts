import styled from "styled-components";


interface FilterButtonProps {
    $isActive: boolean;
}

export const Wrapper = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 0 1rem;
    gap: 0.7rem;
`;

export const FilterButton = styled.button<FilterButtonProps>`
    width: fit-content;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    background-color: ${({ theme }) => theme.colors.White};
    border-radius: 0.75rem;
    padding: 0 0.88rem;
    ${({ theme }) => theme.fonts.Bold14};

    border: 1px solid ${({ $isActive }) => ($isActive ? "#FF5C39" : "#E0E0E0")};
    color: ${({ theme, $isActive }) => ($isActive ? "#FF5C39" : theme.colors.Focused)};
`;

export const FilterIcon = styled.img`
    width: 1rem;
    height: 1rem;
`;

export const ButtonText = styled.span`
    max-width: 35vw; /* 전체 넓이의 35% 정도 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const ClearIcon = styled.span`
  /* 엑스 버튼 스타일 (회색 원형 배경 등) */
`;