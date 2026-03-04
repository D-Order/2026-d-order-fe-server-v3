import * as S from "./LoginPage.styled";
import MainBtn from "@components/button/MainBtn";
import { useState, useEffect } from "react";
import LoginInput from "./components/LoginInput";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@hooks/useLogin";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error, data } = useLogin();

  // 로그인 버튼 클릭 시 API 호출
  const handleLogin = async () => {
    await login({ username: id, password: pw });
  };

  // 에러 메시지에 따라 에러 상태 처리
  useEffect(() => {
    if (error) {
      setIdError(error.includes("아이디"));
      setPwError(error.includes("비밀번호"));
    } else {
      setIdError(false);
      setPwError(false);
    }
  }, [error]);

  // 로그인 성공 시 이동
  useEffect(() => {
    if (data) {
      navigate(ROUTE_CONSTANTS.SERVING);
    }
  }, [data, navigate]);

  // 인풋 변경 시 에러 초기화
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    if (idError) setIdError(false);
  };
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
    if (pwError) setPwError(false);
  };

  // 인풋 포커스 시 에러 해제
  // 아이디 인풋 포커스 시 모든 에러 해제
  const handleIdFocus = () => {
    if (idError) setIdError(false);
    if (pwError) setPwError(false);
  };
  // 비밀번호 인풋 포커스 시 모든 에러 해제
  const handlePwFocus = () => {
    if (idError) setIdError(false);
    if (pwError) setPwError(false);
  };

  const isActive = id.length > 0 && pw.length > 0;

  return (
    <S.Wrapper>
      <S.Contents>
        <S.HeaderSection>
          <S.Title>
            서빙을 더 쉽고,
            <br />
            빠르게
          </S.Title>
          <S.Logo />
        </S.HeaderSection>
        <S.FormSection>
          <LoginInput
            label="아이디"
            type="text"
            value={id}
            placeholder="아이디를 입력해주세요."
            error={idError}
            onChange={handleIdChange}
            onFocus={handleIdFocus}
          />
          <LoginInput
            label="비밀번호"
            type="password"
            value={pw}
            placeholder="비밀번호를 입력해주세요."
            error={pwError}
            onChange={handlePwChange}
            onFocus={handlePwFocus}
          />
          <S.BtnMargin>
            <MainBtn
              text={loading ? "로딩중..." : "서빙 시작하기"}
              onClick={handleLogin}
              disabled={!isActive || loading}
            />
          </S.BtnMargin>
        </S.FormSection>
      </S.Contents>
    </S.Wrapper>
  );
};

export default LoginPage;
