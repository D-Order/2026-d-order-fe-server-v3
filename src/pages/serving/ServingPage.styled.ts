import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(100dvh - 51.5px);
  background-color: ${({ theme }) => theme.colors.Bg};
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

/** 서빙요청·직원호출 탭 아래 남는 영역 — 리스트/빈 화면을 이 안에서 중앙 배치 */
export const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AcceptModalLayer = styled.div`
  position: absolute;
  transform: translate(0, -52px);

  inset: 0;
  z-index: 100;
`;
