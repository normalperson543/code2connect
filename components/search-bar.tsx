'use client'

import { Input } from "@mantine/core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
export default function SearchBar({term, onChangeSearchTerm}: {term: string, onChangeSearchTerm: (newTerm: string) => void}) {
  return (
    <Input
      type="text"
      placeholder="Search"
      leftSection={<MagnifyingGlassIcon width={16} height={16} />}
      classNames={{ input: "bg-offblue-700" }}
      value={term ?? ""}
      onChange={(e) => onChangeSearchTerm(e.target.value)}
    />
  );
}
