import styled from "styled-components";

export const Wrapper = styled.div`
    width: 100%;
    height: fit-content;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 0 1rem;
    gap: 0.7rem;
`;

export const FilterButton = styled.button`
    width: fit-content;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    background-color: ${({ theme }) => theme.colors.White};
    border: 1px solid #E0E0E0;
    border-radius:0.75rem;
    color: ${({ theme }) => theme.colors.Focused};
    ${({ theme }) => theme.fonts.Bold14};
    padding: 0 0.88rem;
`;

export const FilterIcon = styled.img`
    width: 1rem;
    height: 1rem;
`;
