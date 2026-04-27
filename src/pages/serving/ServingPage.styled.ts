import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100)-51.5;
  background-color: ${({ theme }) => theme.colors.Bg};
`;

export const AcceptModalLayer = styled.div`
  position: absolute;
  transform: translate(0, -52px);

  inset: 0;
  z-index: 100;
`;
