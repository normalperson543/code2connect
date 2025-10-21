"use client";

import { Input } from "@mantine/core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query"));

  return (
    <Input
      type="text"
      placeholder="Search"
      leftSection={<MagnifyingGlassIcon width={16} height={16} />}
      classNames={{ input: "bg-offblue-700" }}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          router.push(`/search/?query=${query}`);
        }
      }}
      value={query ?? ""}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
