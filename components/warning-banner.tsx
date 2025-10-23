"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ThemeIcon } from "@mantine/core";

export default function WarningBanner({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-2 bg-red-50 border-l-2 border-solid border-red-400 rounded-sm flex flex-row gap-2">
      <ThemeIcon color="red" radius="xl">
        <ExclamationCircleIcon width={16} height={16} />
      </ThemeIcon>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
