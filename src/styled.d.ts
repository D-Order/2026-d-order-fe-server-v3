import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      Bg: string;
      Bg02: string;
      Point: string;
      Orange00: string;
      Orange01: string;
      Orange02: string;
      Highlight: string;
      Gray01: string;
      BorderGray: string;
      Black01: string;
      Black02: string;
      White: string;
      Black: string;
      Success: string;
      Error: string;
      Focused: string;
    };
    fonts: {
      Bold32: Record<string, string>;
      ExtraBold24: Record<string, string>;
      Bold24: Record<string, string>;
      ExtraBold20: Record<string, string>;
      Bold20: Record<string, string>;
      ExtraBold18: Record<string, string>;
      Bold18: Record<string, string>;
      ExtraBold16: Record<string, string>;
      Bold16: Record<string, string>;
      SemiBold16: Record<string, string>;
      Medium16: Record<string, string>;
      ExtraBold14: Record<string, string>;
      Bold14: Record<string, string>;
      SemiBold14: Record<string, string>;
      Medium14: Record<string, string>;
      ExtraBold12: Record<string, string>;
      Bold12: Record<string, string>;
      SemiBold12: Record<string, string>;
      Medium12: Record<string, string>;
      SemiBold10: Record<string, string>;
    };
  }
}
