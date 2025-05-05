import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { componentStorageName, db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
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
import { swift as lswift } from "@codemirror/legacy-modes/mode/swift";
import { ruby as lruby } from "@codemirror/legacy-modes/mode/ruby";
import { rust as lrust } from "@codemirror/legacy-modes/mode/rust";
import "./addcomponent.css";

const AddComponent = () => {
  const [componentName, setComponentName] = useState("");
  const [componentType, setComponentType] = useState("code");
  const [programmingLanguage, setProgrammingLanguage] = useState("none");
  const [codeBlock, setCodeBlock] = useState("");
  const [componentCategory, setComponentCategory] = useState("none");
  const [languageCompiler, setLanguageCompiler] = useState(ljson());
  const [designFile, setDesignFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);

  const chooseProgLanguageLabelRef = useRef();
  const chooseProgLanguageOptionRef = useRef();
  const codeBlockLabelRef = useRef();
  const codeBlockOptionRef = useRef();
  const componentTypeRef = useRef();
  const componentCategoryRef = useRef();
  const diagramLabelRef = useRef();
  const diagramOptionRef = useRef();
  const documentLabelRef = useRef();
  const documentOptionRef = useRef();
  const loaderRef = useRef();
  const formRef = useRef();
  const { componentID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (componentType === "code") {
      diagramLabelRef.current.classList.add("hidden");
      diagramOptionRef.current.classList.add("hidden");
      documentLabelRef.current.classList.add("hidden");
      documentOptionRef.current.classList.add("hidden");
      chooseProgLanguageLabelRef.current.classList.remove("hidden");
      chooseProgLanguageOptionRef.current.classList.remove("hidden");
      codeBlockLabelRef.current.classList.remove("hidden");
      codeBlockLabelRef.current.nextElementSibling.classList.remove("hidden");
    } else if (componentType === "design") {
      diagramLabelRef.current.classList.remove("hidden");
      diagramOptionRef.current.classList.remove("hidden");
      documentLabelRef.current.classList.add("hidden");
      documentOptionRef.current.classList.add("hidden");
      chooseProgLanguageLabelRef.current.classList.add("hidden");
      chooseProgLanguageOptionRef.current.classList.add("hidden");
      codeBlockLabelRef.current.classList.add("hidden");
      codeBlockLabelRef.current.nextElementSibling.classList.add("hidden");
    } else if (componentType === "document") {
      diagramLabelRef.current.classList.add("hidden");
      diagramOptionRef.current.classList.add("hidden");
      chooseProgLanguageLabelRef.current.classList.add("hidden");
      chooseProgLanguageOptionRef.current.classList.add("hidden");
      codeBlockLabelRef.current.classList.add("hidden");
      codeBlockLabelRef.current.nextElementSibling.classList.add("hidden");
      documentLabelRef.current.classList.remove("hidden");
      documentOptionRef.current.classList.remove("hidden");
    }
  }, [componentType]);

  useEffect(() => {
    if (componentID != null) {
      fetchComponentData();
      loaderRef.current.style.display = "flex";
      formRef.current.style.display = "none";
    } else {
      loaderRef.current.style.display = "none";
      formRef.current.style.display = "grid";
    }
  }, []);

  const fetchComponentData = async () => {
    const docSnap = await getDoc(doc(db, componentStorageName, componentID));
    const data = docSnap.data();
    setComponentName(data.componentName);
    setComponentCategory(data.componentCategory);
    setCodeBlock(data.codeBlock || "");
    setComponentType(data.componentType);
    setProgrammingLanguage(data.programmingLanguage || "none");
    setDesignFile(data.designData || null);
    setDocumentFile(data.documentFile || null);
    loaderRef.current.style.display = "none";
    formRef.current.style.display = "grid";
  };

  useEffect(() => {
    componentCategoryRef.current.value = componentCategory;
  }, [componentCategory]);

  useEffect(() => {
    componentTypeRef.current.value = componentType;
  }, [componentType]);

  useEffect(() => {
    chooseProgLanguageOptionRef.current.value = programmingLanguage;
  }, [programmingLanguage]);

  const addComponent = async () => {
    loaderRef.current.style.display = "flex";
    formRef.current.style.display = "none";
    try {
      await addDoc(collection(db, componentStorageName), {
        componentName,
        componentType,
        componentCategory,
        programmingLanguage,
        codeBlock,
        designData: designFile,
        documentFile: documentFile,
        createdBy: localStorage.getItem("loggedInUser"),
        timestamp: new Date().getTime(),
      });
      alert("Data saved successfully!");
      navigate("/dashboard");
    } catch (e) {
      alert("Error while saving data.");
    } finally {
      loaderRef.current.style.display = "none";
      formRef.current.style.display = "grid";
    }
  };

  const editComponent = async () => {
    loaderRef.current.style.display = "flex";
    formRef.current.style.display = "none";
    try {
      await updateDoc(doc(db, componentStorageName, componentID), {
        componentName,
        componentType,
        componentCategory,
        programmingLanguage,
        codeBlock,
        designData: designFile,
        documentFile: documentFile,
      });
      alert("Data updated successfully!");
      navigate("/dashboard");
    } catch (e) {
      alert("Error while updating data.");
    } finally {
      loaderRef.current.style.display = "none";
      formRef.current.style.display = "grid";
    }
  };

  useEffect(() => {
    switch (programmingLanguage) {
      case "java": setLanguageCompiler(ljava()); break;
      case "cpp": setLanguageCompiler(lcpp()); break;
      case "js": setLanguageCompiler(ljs()); break;
      case "php": setLanguageCompiler(lphp()); break;
      case "css": setLanguageCompiler(lcss()); break;
      case "html": setLanguageCompiler(lhtml()); break;
      case "python": setLanguageCompiler(lpy()); break;
      case "json": setLanguageCompiler(ljson()); break;
      case "xml": setLanguageCompiler(lxml()); break;
      case "swift": setLanguageCompiler(lswift()); break;
      case "ruby": setLanguageCompiler(lruby()); break;
      case "rust": setLanguageCompiler(lrust()); break;
      default: setLanguageCompiler(ljson()); break;
    }
  }, [programmingLanguage]);

  return (
    <>
      <Header />
      <dotlottie-player ref={loaderRef} src="/loading_anim.json" background="transparent" speed="1" style={{ width: "300px", height: "300px", margin: "auto" }} loop autoplay></dotlottie-player>
      <form className="add-component" ref={formRef}>
        <label>Component Name</label>
        <input type="text" value={componentName} onChange={(e) => setComponentName(e.target.value)} placeholder="Enter component name" />

        <label>Component Type</label>
        <select ref={componentTypeRef} onChange={(e) => setComponentType(e.target.value)}>
          <option value="code">Code</option>
          <option value="design">Design</option>
          <option value="document">Document</option>
        </select>

        <label>Component Category</label>
        <select ref={componentCategoryRef} onChange={(e) => setComponentCategory(e.target.value)}>
          <option hidden value="none">Select a category</option>
          <option value="views">Views</option>
          <option value="model">Model</option>
          <option value="controller">Controllers</option>
          <option value="class">Class</option>
          <option value="object">Object</option>
          <option value="data">Data Access Object</option>
          <option value="services">Services</option>
          <option value="plugins">Plugins</option>
          <option value="api">APIs</option>
          <option value="others">Others</option>
        </select>

        <label ref={chooseProgLanguageLabelRef}>Programming Language</label>
        <select ref={chooseProgLanguageOptionRef} onChange={(e) => setProgrammingLanguage(e.target.value)}>
          <option hidden value="none">Choose the code language</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="php">PHP</option>
          <option value="python">Python</option>
          <option value="xml">XML</option>
          <option value="json">JSON</option>
          <option value="others">Others</option>
        </select>

        <label ref={diagramLabelRef}>Upload Design Image</label>
        <input type="file" ref={diagramOptionRef} accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setDesignFile(reader.result);
            reader.readAsDataURL(file);
          } else setDesignFile(null);
        }} />

        <label ref={documentLabelRef} className="hidden">Upload Document</label>
        <input type="file" ref={documentOptionRef} accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setDocumentFile(reader.result);
            reader.readAsDataURL(file);
          } else setDocumentFile(null);
        }} />

        <label ref={codeBlockLabelRef}>Code Block</label>
        <ReactCodeMirror
          ref={codeBlockOptionRef}
          value={codeBlock}
          onChange={(val) => setCodeBlock(val)}
          placeholder="/* Write your code here */"
          minHeight="200px"
          extensions={[languageCompiler]}
        />

        <button type="submit" onClick={(e) => {
          e.preventDefault();
          if (componentName === "") return alert("Please enter a component name");
          if (componentCategory === "none") return alert("Please select a category");
          if (componentType === "code" && programmingLanguage === "none") return alert("Please select a programming language");
          if (componentType === "code" && codeBlock === "") return alert("Please enter the code block");
          if (componentType === "design" && !designFile) return alert("Please upload the design");
          if (componentType === "document" && !documentFile) return alert("Please upload a document");
          componentID ? editComponent() : addComponent();
        }}>
          {componentID ? "Update Component" : "Save Component"}
        </button>
      </form>
    </>
  );
};

export default AddComponent;
