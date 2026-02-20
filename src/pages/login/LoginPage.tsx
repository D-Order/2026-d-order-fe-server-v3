import * as S from "./LoginPage.styled";
import MainBtn from "@components/button/MainBtn";
import { useState } from "react";
import LoginInput from "./components/LoginInput";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);
  const navigate = useNavigate();

  //임시로 로그인로직 구현
  const handleLogin = () => {
    if (id === "test" && pw === "test") {
      navigate("/");
    } else {
      setIdError(true);
      setPwError(true);
    }
  };

  // 인풋 변경 시 에러 초기화
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    if (idError) setIdError(false);
  };
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
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
          />
          <LoginInput
            label="비밀번호"
            type="password"
            value={pw}
            placeholder="비밀번호를 입력해주세요."
            error={pwError}
            onChange={handlePwChange}
          />
          <S.BtnMargin>
            <MainBtn
              text="서빙 시작하기"
              onClick={handleLogin}
              disabled={!isActive}
            />
          </S.BtnMargin>
        </S.FormSection>
      </S.Contents>
    </S.Wrapper>
  );
};

export default LoginPage;
