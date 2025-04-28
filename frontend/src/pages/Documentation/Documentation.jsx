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
      {/* <a
        href="/documentation.pdf"
        download="documentation.pdf"
        className="downloadButton"
      >
        Download PDF
      </a> */}
    </div>
  );
};

export default Documentation;
