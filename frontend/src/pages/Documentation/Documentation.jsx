import React from "react";
import "./documentation.css";

const Documentation = () => {
  return (
    <div className="documentation">
      <iframe
        src="/documentation.pdf"
        title="Documentation"
        className="documentationIframe"
      ></iframe>
    </div>
  );
};

export default Documentation;
