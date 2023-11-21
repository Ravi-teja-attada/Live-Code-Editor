import React, { useEffect, useRef, useState } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Actions from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [language, setLanguage] = useState("JavaScript");
  const [dropdown, setDropdown] = useState("JavaScript")
  const textareaRef = useRef(null);
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("codeEditor"),
        {
          mode: language.toLowerCase(),
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(Actions.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, [language]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(Actions.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      // socketRef.current.off(Actions.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div className="editor_area">
      <div className="editor_bar">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {dropdown}
          </button>
          <ul
            className="dropdown-menu"
            onClick={(e) => {
              setLanguage(e.target.getAttribute("data-language"))
              setDropdown(e.target.innerHTML)
              }}
            aria-labelledby="dropdownMenuButton1"
          >
            <li data-language="javascript">JavaScript</li>
            <li data-language="text/x-java">Java</li>
            <li data-language="python">Python</li>
            <li data-language="text/x-csrc">C</li>
            <li data-language="text/x-c++src">C++</li>
          </ul>
        </div>
      </div>
      <textarea ref={textareaRef} id="codeEditor"></textarea>
    </div>
  );
};

export default Editor;
