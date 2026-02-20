import React, { useState } from "react";
import * as S from "./LoginInput.styled";
import BlockIcon from "@assets/icons/blockIcon.svg?react";
import ViewIcon from "@assets/icons/viewIcon.svg?react";
import ErrorIcon from "@assets/icons/errorIcon.svg?react";
interface LoginInputProps {
  label: string;
  type: "text" | "password";
  value: string;
  placeholder?: string;
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginInput: React.FC<LoginInputProps> = ({
  label,
  type,
  value,
  placeholder,
  error,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <S.InputWrapper>
      <S.Label error={error}>{label}</S.Label>
      <S.InputBox error={error}>
        <S.Input
          type={isPassword && !showPassword ? "password" : "text"}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {isPassword && !error ? (
          <S.Icon
            onClick={() => setShowPassword((v) => !v)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <ViewIcon /> : <BlockIcon />}
          </S.Icon>
        ) : null}
        {error ? (
          <S.ErrorIcon>
            <ErrorIcon />
          </S.ErrorIcon>
        ) : null}
      </S.InputBox>
    </S.InputWrapper>
  );
};

export default LoginInput;
