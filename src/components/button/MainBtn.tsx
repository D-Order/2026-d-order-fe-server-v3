import styled from "styled-components";

interface BtnProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const MainBtn = ({ text, onClick, disabled = false }: BtnProps) => {
  return (
    <BtnContainer onClick={onClick} disabled={disabled}>
      {text}
    </BtnContainer>
  );
};

export default MainBtn;

const BtnContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 56px;
  border-radius: 10px;

  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.Black02 : theme.colors.Orange01};
  color: ${({ theme }) => theme.colors.Bg};
  ${({ theme }) => theme.fonts.Bold16};

  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: ${({ disabled }) => (disabled ? "none" : "scale(1.05)")};
  }
  @media (hover: none) {
    &:active {
      transform: ${({ disabled }) => (disabled ? "none" : "scale(1.05)")};
    }
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
