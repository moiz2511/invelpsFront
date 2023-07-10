import React from "react";
import "../../../../assets/styles/Button.css";

function Button({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={style} className="common-button">
      {children}
    </button>
  );
}

export default Button;
