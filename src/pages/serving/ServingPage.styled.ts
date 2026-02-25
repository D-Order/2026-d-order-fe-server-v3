import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: ${({ theme }) => theme.colors.Bg};
`;
