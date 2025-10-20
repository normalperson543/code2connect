"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FakeLoadingTerminal() {
  const [loaderStatus, setLoaderStatus] = useState(0);
  const [caret, setCaret] = useState(true);
  const pathname = usePathname();

  const loader = ["|", "/", "-", "\\"];

  useEffect(() => {
    setTimeout(() => setLoaderStatus(loaderStatus + 1), 100);
    setTimeout(() => setCaret(!caret), 500);
  });
  return (
    <div className="p-2 rounded-md bg-gray-900 h-1/3 w-2/3 font-mono text-lg text-green-500">
      <p>$ curl -O {pathname}</p>
      <p>
        Loading... {loader[loaderStatus % 4]}
        {caret ? "█" : ""}
      </p>
    </div>
  );
}
