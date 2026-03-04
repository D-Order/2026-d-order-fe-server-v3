import { useState } from "react";
import * as S from "./TableResetSheet.styled";
import sadKokkiri from "@assets/images/sadKokkiri.png";

interface TableResetSheetProps {
  onClose: () => void;
  onSubmit: (tableNumber: string) => void;
}

const TableResetSheet = ({ onClose, onSubmit }: TableResetSheetProps) => {
  const [tableNumber, setTableNumber] = useState("");

  const handleKeyPress = (val: string) => {
    if (tableNumber.length < 3) setTableNumber((prev) => prev + val);
  };

  const handleDelete = () => {
    setTableNumber((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (tableNumber) {
      onSubmit(tableNumber);
      onClose();
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.SheetContainer onClick={(e) => e.stopPropagation()}>
        <S.HandleBar />
        <S.Title>테이블 번호를 입력해주세요</S.Title>
        <S.InputBox>{tableNumber || "테이블 번호를 입력해주세요"}</S.InputBox>
        <S.KeypadGrid>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <S.KeyButton
              key={num}
              onClick={() => handleKeyPress(num.toString())}
            >
              {num}
            </S.KeyButton>
          ))}
          {/* 코끼리 아이콘 */}
          <S.KeyButton>
            <img src={sadKokkiri} alt="kokkiri" />
          </S.KeyButton>
          <S.KeyButton onClick={() => handleKeyPress("0")}>0</S.KeyButton>
          {/* 지우기 버튼 */}
          <S.KeyButton onClick={handleDelete}>⌫</S.KeyButton>
        </S.KeypadGrid>
        <S.SubmitButton onClick={handleSubmit}>선택완료</S.SubmitButton>
      </S.SheetContainer>
    </S.Overlay>
  );
};

export default TableResetSheet;
