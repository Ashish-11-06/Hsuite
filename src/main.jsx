import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/store";
import App from "./App";
import "antd/dist/reset.css"; // Ant Design styles
import "./index.css"; // Custom global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}> {/* Ensure Provider wraps App */}
      <App />
    </Provider>
  </React.StrictMode>
);
