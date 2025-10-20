"use client";
import { placeholder } from "@/app/lib/constants";
import { Title, Text, Pagination } from "@mantine/core";
import ProjectCard from "../project-card";
import { useState } from "react";
import Heading from "../heading";
import SearchBar from "../search-bar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchUI({
  pages,
  children,
}: {
  searchTerm: string;
  page: number;
  pages: number;
  children: React.ReactNode;
}) {
  const [term, setTerm] = useState("");
  const [activePage, setActivePage] = useState(1);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 1000);
  const handleChangePage = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (activePage) {
      params.set("page", String(activePage));
    } else {
      params.delete("page");
    }
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 1000);
  return (
    <div className="flex flex-col gap-2">
      <Heading>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/2">
            {term ? (
              <>
                <Title>Search results for {term}</Title>
                <Text>returned {pages * 10}+ results</Text>
              </>
            ) : (
              <Title>Search projects</Title>
            )}
          </div>
          <div className="flex-1">
            <SearchBar
              term={term}
              onChangeSearchTerm={(newTerm: string) => {
                setTerm(newTerm);
                handleSearch();
              }}
            />
          </div>
        </div>
      </Heading>
      <div className="items-center flex flex-col gap-2">
        <div className="flex flex-row gap-4 flex-wrap pl-30 pr-30">
          {children}
        </div>

        <Pagination
          total={pages}
          value={activePage}
          onChange={(newPage: number) => {
            setActivePage(newPage);
            handleChangePage();
          }}
        />
      </div>
    </div>
  );
}
