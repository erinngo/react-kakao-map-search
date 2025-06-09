import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

//root 설정하고 그 하위에 APP컴포넌트 렌더링
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
