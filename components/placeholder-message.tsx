"use client";

export default function PlaceholderMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 items-center justify-center text-center p-4 border-dashed border-offblue-200 border-4 bg-offblue-50 rounded-sm h-full">
      {children}
    </div>
  );
}
