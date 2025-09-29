export default function Heading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pl-16 pr-16 pt-8 pb-8 bg-offblue-700 border-b-offblue-800 text-white border-b-1">
      {children}
    </div>
  );
}
