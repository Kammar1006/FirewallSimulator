import React from "react";
import "./loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <span className="loadingSpinner"></span>

      <span className="loadingText"></span>
    </div>
  );
};

export default Loading;
