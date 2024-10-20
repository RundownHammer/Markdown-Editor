import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Button } from "@mui/material";
import { useState } from "react";
import "./styles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  const [content, setContent] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [preview, setPreview] = useState(false);

  function handleTextChange(e) {
    const newContent = e.target.value;
    setContent(newContent);
    setMarkdown(handlePreview(newContent));
  }

  function handlePreview(text) {
    const heading1Pattern = /^# (.*)$/gm;
    const heading2Pattern = /^## (.*)$/gm;
    const heading3Pattern = /^### (.*)$/gm;
    const boldPattern = /\*\*(.*?)\*\*/g;
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const listPattern = /^[-*]\s+(.*)/gm;
    const codeBlockPattern = /```([\s\S]*?)```/gm;
    const imagePattern =  /!\[([^\]]+)\]\(([^)]+)\)/g;

    let markdownText = text
      .replace(heading1Pattern, "<h1>$1</h1>")
      .replace(heading2Pattern, "<h2>$1</h2>")
      .replace(heading3Pattern, "<h3>$1</h3>")
      .replace(boldPattern, "<strong>$1</strong>")
      .replace(linkPattern, '<a href="$2">$1</a>')
      .replace(codeBlockPattern, "<pre><code>$1</code></pre>")
      .replace(listPattern, "<li>$1</li>")
      .replace(/^(?!<li>)(?!<pre><code>)(.+)$/gm, "<p>$1</p>")
      .replace(imagePattern, '<img src="$2" alt="$1">');

    return markdownText;
  }

  function downloadHTML(content, filename) {
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  return (<>
    <Header />
    <div className="App">
      <TextareaAutosize
        onChange={handleTextChange}
        value={content}
        placeholder="Enter your markdown here"
        minRows={24}
        className="textarea"
      />
      <div className="button-container">
        <Button
          className="button"
          onClick={() => setPreview(!preview)}
          variant={!preview ? "outlined" : "contained"}
        >
          {preview ? "Hide Preview" : "Show preview"}
        </Button>
        <Button
          className="button"
          variant="outlined"
          onClick={() => {
            setContent("");
          }}
        >
          Clear
        </Button>
        <Button
          className="button"
          variant="outlined"
          onClick={() => {
            downloadHTML(markdown, "markdown_output.html");
          }}
        >
          Download as HTML
        </Button>
      </div>
      {preview && (
        <div
          dangerouslySetInnerHTML={{ __html: markdown }}
          className="preview"
        ></div>
      )}
    </div>
    <Footer />  
    </>
  );
}
