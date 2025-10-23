"use client";
import { Title, Pagination, Input } from "@mantine/core";
import { useState } from "react";
import Heading from "../heading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchUI({
  pages,
  children,
  count,
}: {
  page: number;
  pages: number;
  count: number;
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("query"));
  const [activePage, setActivePage] = useState(1);

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
                <Title>Search results</Title>
                {count === 0 ? (
                  <p>returned no results</p>
                ) : (
                  <p>
                    returned {count} result{count !== 1 && "s"}
                  </p>
                )}
              </>
            ) : (
              <Title>Search projects</Title>
            )}
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search"
              leftSection={<MagnifyingGlassIcon width={16} height={16} />}
              value={term ?? ""}
              onChange={(e) => {
                setTerm(e.target.value);
                handleSearch();
              }}
            />
          </div>
        </div>
      </Heading>
      <div className="items-center flex flex-col gap-2">
        <div className="flex flex-row gap-4 flex-wrap pl-16 pr-16 w-full h-full">
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
