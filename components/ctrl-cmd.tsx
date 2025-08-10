"use client";
import { Kbd } from "@mantine/core";
import { useOs } from "@mantine/hooks";

export default function CtrlCmd() {
  const os = useOs();
  if (os === "macos") {
    return <Kbd>⌘</Kbd>;
  } else {
    return <Kbd>Ctrl</Kbd>;
  }
}
