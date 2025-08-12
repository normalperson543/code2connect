import CodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import {
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { python } from "@codemirror/lang-python";
import { lintKeymap } from "@codemirror/lint";
import { auraInit } from "@uiw/codemirror-theme-aura";
import { tags as t } from "@lezer/highlight";
import { Roboto_Mono } from "next/font/google";
import { RefAttributes, useRef } from "react";

interface Props
  extends ReactCodeMirrorProps,
    RefAttributes<ReactCodeMirrorRef> {}

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export default function CodeEditor({ ...props }: Props) {
  const cmRef = useRef(null);
  return (
    <CodeMirror
      {...props}
      extensions={[
        // A line number gutter
        lineNumbers(),
        // A gutter with code folding markers
        foldGutter(),
        // Replace non-printable characters with placeholders
        highlightSpecialChars(),
        // The undo history
        history({ minDepth: 100, newGroupDelay: 50 }),
        // Replace native cursor/selection with our own
        drawSelection(),
        // Show a drop cursor when dragging over the editor
        dropCursor(),
        // Allow multiple cursors/selections
        EditorState.allowMultipleSelections.of(true),
        // Re-indent lines when typing specific input
        indentOnInput(),
        // Highlight matching brackets near cursor
        bracketMatching(),
        // Automatically close brackets
        closeBrackets(),
        // Load the autocompletion system
        autocompletion(),
        // Allow alt-drag to select rectangular regions
        rectangularSelection(),
        // Change the cursor to a crosshair when holding alt
        crosshairCursor(),
        // Style the current line specially
        highlightActiveLine(),
        // Style the gutter for current line specially
        highlightActiveLineGutter(),
        // Highlight text that matches the selected text
        highlightSelectionMatches(),
        keymap.of([
          // Closed-brackets aware backspace
          ...closeBracketsKeymap,
          // A large set of basic bindings
          ...defaultKeymap,
          // Search-related keys
          ...searchKeymap,
          // Redo/undo keys
          ...historyKeymap,
          // Code folding bindings
          ...foldKeymap,
          // Autocompletion keys
          ...completionKeymap,
          // Keys related to the linter system
          ...lintKeymap,
        ]),
        python(),
      ]}
      height="100%"
      theme={auraInit({
        settings: {
          caret: "#c6c6c6",
          fontFamily: "'Roboto Mono', monospace",
        },
        styles: [{ tag: t.comment, color: "#6272a4" }],
      })}
      className={`${robotoMono.className} overflow-auto w-full h-full`}
    />
  );
}
