"use client";

import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/app/context/ThemeContext";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder,
}) => {
  const { theme } = useTheme();
  console.log(":theme:", theme)
  const [editorContent, setEditorContent] = useState(value);

  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 text-foreground">
      {label && (
        <label htmlFor="editor" className="block text-sm font-bold mb-2">
          {label}
        </label>
      )}

      <Editor
        key={theme}
        id="blog-editor"
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // Get this from TinyMCE Cloud
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "mentions",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter | " +
            " imagelink image media table mergetags |" +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          skin: theme == 'dark' ? "oxide-dark" : "oxide",
          content_css: theme == 'dark' ? "dark" : "default",
        }}
        value={editorContent}
        onEditorChange={(newValue, editor) => {
          setEditorContent(newValue);
          onChange(newValue);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
