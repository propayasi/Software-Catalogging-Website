import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, componentStorageName } from "../../firebase";
import Header from "../header/header";
import ReactCodeMirror from "@uiw/react-codemirror";
import { cpp as lcpp } from "@codemirror/lang-cpp";
import { css as lcss } from "@codemirror/lang-css";
import { html as lhtml } from "@codemirror/lang-html";
import { java as ljava } from "@codemirror/lang-java";
import { javascript as ljs } from "@codemirror/lang-javascript";
import { json as ljson } from "@codemirror/lang-json";
import { php as lphp } from "@codemirror/lang-php";
import { python as lpy } from "@codemirror/lang-python";
import { xml as lxml } from "@codemirror/lang-xml";
import "./viewcomponent.css";

const ViewComponent = () => {
  const { componentID } = useParams();
  const [componentData, setComponentData] = useState(null);
  const [languageCompiler, setLanguageCompiler] = useState(ljson());

  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, componentStorageName, componentID));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setComponentData(data);
        switch (data.programmingLanguage) {
          case "java": setLanguageCompiler(ljava()); break;
          case "cpp": setLanguageCompiler(lcpp()); break;
          case "js": setLanguageCompiler(ljs()); break;
          case "php": setLanguageCompiler(lphp()); break;
          case "css": setLanguageCompiler(lcss()); break;
          case "html": setLanguageCompiler(lhtml()); break;
          case "python": setLanguageCompiler(lpy()); break;
          case "json": setLanguageCompiler(ljson()); break;
          case "xml": setLanguageCompiler(lxml()); break;
          default: setLanguageCompiler(ljson()); break;
        }
      }
    };
    fetchData();
  }, [componentID]);

  if (!componentData) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <Header />
      <div className="view-component">
        <h2>{componentData.componentName}</h2>
        <p><strong>Type:</strong> {componentData.componentType}</p>
        <p><strong>Category:</strong> {componentData.componentCategory}</p>

        {componentData.componentType === "code" && (
          <>
            <p><strong>Language:</strong> {componentData.programmingLanguage}</p>
            <ReactCodeMirror
              value={componentData.codeBlock}
              readOnly={true}
              minHeight="300px"
              extensions={[languageCompiler]}
            />
          </>
        )}

        {componentData.componentType === "design" && componentData.designData && (
          <img
            src={componentData.designData}
            alt="Design Preview"
            style={{ maxWidth: "100%", marginTop: "1.5rem" }}
          />
        )}

        {componentData.componentType === "document" && componentData.documentFile && (
          <div style={{ marginTop: "2rem" }}>
            <a
              href={componentData.documentFile}
              target="_blank"
              rel="noopener noreferrer"
              download={componentData.componentName + ".file"}
              className="download-btn"
            >
              Download Document
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewComponent;
