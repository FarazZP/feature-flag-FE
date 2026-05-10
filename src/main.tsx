import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import { Providers } from "./app/provider";
import "./styles.css";

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  );
}
