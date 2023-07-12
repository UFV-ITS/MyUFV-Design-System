import { useEffect, useState } from "preact/hooks";
import type { FunctionComponent } from "preact";

import "./BrowserPreview.css";

import { getHighlighter, setCDN, Lang, Highlighter } from "shiki";
setCDN("https://unpkg.com/shiki/");

type BrowserPreviewProps = {
  title?: string;
  code: string;
  codeVisible?: boolean;
  codeLanguage?: Lang;
};

/**
 * uses the singleton pattern to create
 * a single instance of Shiki Highlighter and store it in the window.
 *
 * Typically you would store this in a global state management system/context provider.
 * Given we're working with a static site using islands, we can store it in the window so it's globally available.
 *
 * @returns a singleton instance of Shiki Highlighter
 */
const getOrCreateShikiSingleton = async (): Promise<Highlighter> => {
  // @ts-ignore
  if (window.highlighter) {
    // @ts-ignore
    return (await window.highlighter) as Highlighter;
  }

  // @ts-ignore
  window.highlighter = getHighlighter({
    theme: "github-light",
    langs: ["html", "css", "javascript"],
  });
  // @ts-ignore
  return await window.highlighter;
};

const BrowserPreview: FunctionComponent<BrowserPreviewProps> = ({
  title,
  code,
  codeVisible = false,
  codeLanguage = "html",
  children,
}) => {
  const [isCodeVisible, setIsCodeVisible] = useState<boolean>(codeVisible);
  const [codePreviewEl, setCodePreviewEl] = useState<null | string>(null);

  // add code preview using Shiki
  useEffect(() => {
    const createCodePreview = async () => {
      const highlighter = await getOrCreateShikiSingleton();
      const html = highlighter.codeToHtml(code, { lang: codeLanguage });
      setCodePreviewEl(html);
    };
    createCodePreview();
  }, [code]);

  // TODO: add copy to clipboard functionality
  const handleCodeCopy = (e: MouseEvent) => {
    e.preventDefault();
    if (navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          alert("code copied to clipboard");
        })
        .catch((err) => {
          alert("failed to copy code to clipboard");
        });
    } else {
      alert(
        `your browser doesn't support clipboard API; copy the code manually`
      );
    }
  };

  // TODO: add view source functionality
  const handleViewSource = (e: MouseEvent) => {
    e.preventDefault();
    setIsCodeVisible(!isCodeVisible);
  };

  return (
    <div className="browser-preview">
      <div className="browser-preview__header">
        <p className="browser-preview__header__title">{title}</p>
      </div>
      {children && <div className="browser-preview__preview">{children}</div>}
      {isCodeVisible && codePreviewEl ? (
        <div
          className="browser-preview__code"
          dangerouslySetInnerHTML={{ __html: codePreviewEl }}
        />
      ) : null}
      <div className="browser-preview__buttons">
        <button className="btn--primary" onClick={handleViewSource}>
          <span>{isCodeVisible ? "Hide" : "View"} Source</span>
          <i className="fa-duotone fa-code fa-lg"></i>
        </button>
        <button className="btn--secondary" onClick={handleCodeCopy}>
          <span>Copy Code</span>
          <i className="fa-duotone fa-copy fa-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default BrowserPreview;
