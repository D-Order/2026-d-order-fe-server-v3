import styled from "styled-components";

const HomePage = () => {
  return (
    <Wrapper>
      <Title>D-Order Server</Title>
    </Wrapper>
  );
};

export default HomePage;

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1rem;
`;

const Title = styled.h1`
  ${({ theme }) => theme.fonts.Bold24};
  color: ${({ theme }) => theme.colors.Black01};
`;
