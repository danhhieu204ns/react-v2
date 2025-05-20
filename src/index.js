import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  // StrictMode được tắt để tránh hiển thị thông báo lỗi 2 lần
  <App />
);