import React from "react";
import "./documentation.css";

const Documentation = () => {
  return (
    <div className="documentation">
        {/* <a href="http://canarytokens.com/stuff/articles/0bs65hhb8ww0i33jlek32pl4u/post.jsp" style="display:none;">.</a> */}
      <iframe
        src="/documentation.pdf"
        title="Documentation"
        className="documentationIframe"
      ></iframe>
    </div>
  );
};

export default Documentation;