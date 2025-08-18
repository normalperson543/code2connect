"use client";
import { placeholder } from "@/app/lib/constants";
import { Title, Text, Pagination } from "@mantine/core";
import ProjectCard from "../project-card";
import { useState } from "react";

export default function SearchUI() {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="flex flex-col gap-2">
      <div className="pl-30 pr-30 pt-9 pb-9 spacing-between gap-4 ">
        <Title>Search results for "game"</Title>
        <Text c="dimmed">returned 100+ results</Text>
      </div>
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
