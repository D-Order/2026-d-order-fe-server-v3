/** 모달 하단 CTA 3가지: 결제 확인(슬라이드) / 서비스 완료(슬라이드) / 서비스 완료(클릭) */
export type ServingAcceptModalVariant =
  | "payment"
  | "serviceSlide"
  | "serviceClick";

export interface ServingAcceptModalConfig {
  title: string;
  /** 슬라이드용 라벨 (payment, serviceSlide) */
  slideLabel?: string;
  /** 슬라이드 완료 시 문구 */
  completedText: string;
  /** 클릭용 라벨 (serviceClick) */
  clickLabel?: string;
  /** 클릭 완료 시 문구 (확인되었습니다!) */
  clickCompletedText?: string;
}

export const SERVING_ACCEPT_MODAL_CONFIG: Record<
  ServingAcceptModalVariant,
  ServingAcceptModalConfig
> = {
  payment: {
    title: "결제 정보를\n확인하러 가는 중입니다.",
    slideLabel: "밀어서 결제 확인",
    completedText: "결제 확인",
  },
  serviceSlide: {
    title: "띵동 ~🔔\n손님 맞이하러 가는 중입니다",
    slideLabel: "밀어서 서비스 완료",
    completedText: "서비스 완료",
  },
  serviceClick: {
    title: "서빙하러 찾아가는 중입니다",
    clickLabel: "눌러서 서비스 완료",
    completedText: "서비스 완료",
    clickCompletedText: "확인되었습니다!",
  },
};
