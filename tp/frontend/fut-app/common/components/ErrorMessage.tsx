import React from "react";
import { COLORS, FONTS } from "../../styles/style";
import { HorizontalStack } from "./flex";

const ErrorMessage = ({ message }: { message: String }) => {
  return (
    <HorizontalStack style={{ width: "100%" }}>
      <div
        style={{
          fontFamily: FONTS.comments.fontFamily,
          fontStyle: FONTS.comments.fontStyle,
          fontSize: FONTS.comments.fontSize,
          fontWeight: FONTS.comments.fontWeight,
          color: COLORS.rose,
          textAlign: "center",
          width: "100%",
          margin: "10px",
        }}
      >
        {message}
      </div>
    </HorizontalStack>
  );
};

export default ErrorMessage;
