import { Files } from "@/app/lib/files";
import Editor from "@/components/projects/editor/editor";
import { useDebouncedCallback } from "use-debounce";

export default async function EditorPage() {
  const files = {
    "9d5d443b-7211-4baa-9526-a7679c7a5a1b": {
      name: "main.py",
      contents: `print("Hello World")`,
    },
    "2941e3b2-0567-4dbf-9345-51aa736f85b5": {
      name: "module-2.py",
      contents: `print("Module 2!")`,
    },
  };
  async function save(
    files: Files,
    description: string,
    title: string,
    thumbnail: Blob,
  ) {
    "use server";
    try {
      console.log("Saving...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      //throw new Error("oh no a terrible error happened!")
      console.log("Saved");
      console.log(files);
      console.log(description);
      console.log(title);
      console.log(thumbnail);
      return { status: "success", message: "" };
    } catch (e) {
      if (e instanceof Error) {
        return { status: "error", message: e.message };
      }
      return { status: "error", message: "Unknown error" };
    }
  }
  return (
    <Editor
      creator="normalperson543"
      canEditInfo={true}
      files={files}
      description="a description"
      previewUrl="http://localhost:5173"
      id="a"
      title="Guess the Number"
      handleSave={save}
    />
  );
}
