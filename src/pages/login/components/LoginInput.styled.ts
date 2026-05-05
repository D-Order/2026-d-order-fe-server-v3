import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label<{ $error?: boolean }>`
  font: ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ $error, theme }) =>
    $error ? theme.colors.Error : theme.colors.Orange01};
  margin-bottom: 10px;

  ${({ theme }) => theme.fonts.SemiBold16};
`;

export const InputBox = styled.div<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 10px;
  border: 1px solid
    ${({ $error, theme }) =>
      $error ? theme.colors.Error : theme.colors.Focused};
  background: ${({ theme }) => theme.colors.Bg};
  padding: 15px 17px;
  box-sizing: border-box;
  width: 100%;
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  ${({ theme }) => theme.fonts.SemiBold16};
  color: ${({ theme }) => theme.colors.Black02};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.Focused};
    ${({ theme }) => theme.fonts.SemiBold16};
  }
`;

export const Icon = styled.div`
  width: 23px;
  height: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg,
  span {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

export const ErrorIcon = styled.div`
  width: 23px;
  height: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.Error};
  position: absolute;
  right: 12px;
  svg,
  span {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;
