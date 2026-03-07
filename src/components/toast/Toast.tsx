import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface ToastProps {
  message: string;
  duration?: number; // 기본값 3초
  type?: "default" | "error"; // 타입 프롭스 추가 (선택적)
  onClose?: () => void;
}

export default function Toast({
  message,
  duration = 3000,
  type = "default",
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const iconSrc =
    type === "error"
      ? IMAGE_CONSTANTS.exclamationIcon
      : IMAGE_CONSTANTS.checkIcon;
  return (
    <ToastContainer $type={type}>
      <IconWrapper>
        <img src={iconSrc} alt="check" width={24} height={24} />
      </IconWrapper>
      <Message>{message}</Message>
    </ToastContainer>
  );
}

const slideDown = keyframes`
  0% {
    top: -50px;
    opacity: 0;
  }
  100% {
    top: 1rem; 
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $type: "default" | "error" }>`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  width: 90%;
  max-width: 500px;
  padding: 16px;
  box-sizing: border-box;
  background: ${({ $type }) => ($type === "error" ? "#414141" : "#ff6e3f")};
  border-radius: 8px;
  display: flex;
  align-items: center;
  text-align: center;
  gap: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

  animation:
    ${slideDown} 0.3s ease-out forwards,
    ${fadeOut} 0.3s ease-out 2.7s forwards;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  & img {
    width: 18px;
    height: auto;
  }
`;

const Message = styled.div`
  display: flex;

  ${({ theme }) => theme.fonts.Bold14};
  color: ${({ theme }) => theme.colors.Bg};
`;
