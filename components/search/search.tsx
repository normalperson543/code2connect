"use client";
import { placeholder } from "@/app/lib/constants";
import { Title, Text, Pagination } from "@mantine/core";
import ProjectCard from "../project-card";
import { useState } from "react";
import Heading from "../heading";
import SearchBar from "../search-bar";

export default function SearchUI() {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="flex flex-col gap-2">
      <Heading>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-1/2">
          <Title>Search results for "game"</Title>
          <Text>returned 100+ results</Text>
          </div>
          <div className="flex-1">
            <SearchBar bgColor="" />
          </div>
        </div>
        
      </Heading>
      <div className="items-center flex flex-col gap-2">
        <div className="flex flex-row gap-4 flex-wrap pl-30 pr-30">
          {placeholder.map((project) => (
            <ProjectCard projectInfo={project} />
          ))}
        </div>

        <Pagination total={5} value={activePage} onChange={setActivePage} />
      </div>
    </div>
  );
}
