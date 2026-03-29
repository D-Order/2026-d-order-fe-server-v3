import * as S from "./ServingAcceptModal.styled";
import { useRef, useState, useCallback, useEffect } from "react";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
import {
  type ServingAcceptModalVariant,
  SERVING_ACCEPT_MODAL_CONFIG,
} from "./types";

const SLIDE_COMPLETE_THRESHOLD = 0.88;
/** 클릭형: transition이 끝난 뒤에 완료 내용이 나오도록 하는 시간(ms). CSS transition과 동일하게 맞출 것 */
const CLICK_COMPLETE_TRANSITION_MS = 220;

export interface ServingAcceptModalProps {
  variant?: ServingAcceptModalVariant;
  /** 밀어서 서비스 완료(또는 결제 확인) 슬라이드가 끝까지 완료된 시점 */
  onSlideComplete?: () => void;
  /** 클릭형(serviceClick)에서 서비스 완료가 확정된 시점 */
  onClickComplete?: () => void;
  /** 좌상단 닫기(뒤로) 버튼 */
  onClose?: () => void;
  /** 우상단 주문 취소 */
  onCancelOrder?: () => void;
}

const ServingAcceptModal = ({
  variant = "serviceSlide",
  onSlideComplete,
  onClickComplete,
  onClose,
  onCancelOrder,
}: ServingAcceptModalProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  /** 클릭형: true면 기존 내용이 transition으로 나가고, 끝나면 isCompleted로 전환 */
  const [isClickExiting, setIsClickExiting] = useState(false);
  const clickCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const config = SERVING_ACCEPT_MODAL_CONFIG[variant];
  const isSlide = variant === "payment" || variant === "serviceSlide";
  const isClick = variant === "serviceClick";

  /* 손가락 위치 = 공 중심이 되도록 */
  const getProgressFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const remPx =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const startPx = (0.25 + 1.75) * remPx;
    const endPx = rect.width - (0.25 + 1.75) * remPx;
    const travel = endPx - startPx;
    if (travel <= 0) return 0;
    const x = clientX - rect.left - startPx;
    return Math.max(0, Math.min(1, x / travel));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isCompleted) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [isCompleted]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || isCompleted) return;
      setSlideProgress(getProgressFromClientX(e.clientX));
    },
    [isCompleted, getProgressFromClientX]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      e.currentTarget.releasePointerCapture(e.pointerId);
      isDraggingRef.current = false;
      setIsDragging(false);
      const progress = getProgressFromClientX(e.clientX);
      if (progress >= SLIDE_COMPLETE_THRESHOLD) {
        setSlideProgress(1);
        setIsCompleted(true);
        onSlideComplete?.();
      } else {
        setSlideProgress(0);
      }
    },
    [getProgressFromClientX, onSlideComplete]
  );

  const handleClickComplete = useCallback(() => {
    if (!isClick || isCompleted || isClickExiting) return;
    setIsClickExiting(true);
    clickCompleteTimeoutRef.current = setTimeout(() => {
      clickCompleteTimeoutRef.current = null;
      setIsCompleted(true);
      setIsClickExiting(false);
      onClickComplete?.();
    }, CLICK_COMPLETE_TRANSITION_MS);
  }, [isClick, isCompleted, isClickExiting, onClickComplete]);

  // 클릭형 transition 대기 중 unmount 시 타이머 해제
  useEffect(() => {
    return () => {
      if (clickCompleteTimeoutRef.current)
        clearTimeout(clickCompleteTimeoutRef.current);
    };
  }, []);

  const titleLines = config.title.split("\n");

  return (
    <S.Wrapper>
      <S.TopSection>
        <S.TopSectionCloseBtn
          src={IMAGE_CONSTANTS.ServingAcceptModal.CloseBtn}
          alt="닫기"
          onClick={() => onClose?.()}
          role="button"
        />
        <S.TopSectionRejectBtn type="button" onClick={() => onCancelOrder?.()}>
          주문 취소
        </S.TopSectionRejectBtn>
      </S.TopSection>
      <S.InformationSection>
        <S.InformationSectionTitle>
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </S.InformationSectionTitle>
        <S.InformationSectionImage
          src={IMAGE_CONSTANTS.ServingAcceptModal.RejectBtn}
        />
        <S.InformationSectionContent>
          4번 테이블 <S.InformationSectionDiveider />
          49,500원
        </S.InformationSectionContent>
      </S.InformationSection>

      <S.BottomAnimationSection>
        {isSlide && (
          <S.SlideTrack
            $isCompleted={isCompleted}
            ref={trackRef}
            $progress={isCompleted ? 1 : slideProgress}
          >
            <S.SlideTrackFill />
            <S.SlideTrackLabel>{config.slideLabel}</S.SlideTrackLabel>
            <S.SlideThumb
              $progress={isCompleted ? 1 : slideProgress}
              $isDragging={isDragging}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {isCompleted ? (
                <S.SlideThumbIcon
                  src={IMAGE_CONSTANTS.ServingAcceptModal.CheckIcon}
                  alt="완료"
                  $visible
                />
              ) : (
                <S.SlideCompletedArrow
                  src={IMAGE_CONSTANTS.ServingAcceptModal.RightArrow}
                  $visible={!isDragging}
                />
              )}
            </S.SlideThumb>

            <S.SlideCompletedWrap $visible={isCompleted}>
              <S.SlideCompletedCheck
                src={IMAGE_CONSTANTS.ServingAcceptModal.Check}
                alt="완료"
              />
              <S.SlideCompletedText>
                {config.completedText}
              </S.SlideCompletedText>
            </S.SlideCompletedWrap>
          </S.SlideTrack>
        )}

        {isClick && (
          <S.ClickTrack
            type="button"
            $checkBg={IMAGE_CONSTANTS.ServingAcceptModal.Check}
            onClick={handleClickComplete}
          >
            {/* 완료 시에만 좌측 별. 미완료 시엔 없어서 텍스트가 아이콘 제외 영역 기준으로만 중앙 정렬됨 */}
            {isCompleted && <S.ClickTrackLeft></S.ClickTrackLeft>}
            <S.ClickTrackCenter $isExiting={isClickExiting}>
              <S.ClickTrackLabel $completed={isCompleted}>
                {isCompleted
                  ? (config.clickCompletedText ?? config.completedText)
                  : config.clickLabel}
              </S.ClickTrackLabel>
            </S.ClickTrackCenter>
            <S.ClickTrackIconWrap $isExiting={isClickExiting}>
              <S.ClickTrackIcon
                src={
                  isCompleted
                    ? IMAGE_CONSTANTS.ServingAcceptModal.CheckIcon
                    : IMAGE_CONSTANTS.ServingAcceptModal.CheckIcon2
                }
                $visible={isCompleted}
                alt={isCompleted ? "확인" : ""}
              />
            </S.ClickTrackIconWrap>
          </S.ClickTrack>
        )}
      </S.BottomAnimationSection>
    </S.Wrapper>
  );
};

export default ServingAcceptModal;

export type { ServingAcceptModalVariant };
