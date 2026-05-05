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

/** 탭 전환 시 언마운트하지 않고 숨김 — 서빙 패널·WS·상태 유지로 전체 깜빡임 완화 */
export const TabPanel = styled.div<{ $visible: boolean }>`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  flex-direction: column;
`;

export const AcceptModalLayer = styled.div`
  position: absolute;
  transform: translate(0, -52px);

  inset: 0;
  z-index: 100;
`;
